import cron from "node-cron";
import { Remainder, User, Friend, Ritual } from "../models/index.js";
import moment from "moment-timezone";
import { notify } from "./notification.js";
import { isReasonableHour } from "./timezone.js";

function startReminderScheduler() {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const due = await Remainder.find({
        completed: false,
        scheduledTime: { $lte: now },
      });

      for (const r of due) {
        const user = await User.findById(r.userId);
        const friend = r.friendId ? await Friend.findById(r.friendId) : null;
        const tz = (friend && friend.timezone) || user?.timezone || "UTC";

        if (!isReasonableHour(now, tz)) {
          const next9 = moment(now)
            .tz(tz)
            .hour(9)
            .minute(0)
            .second(0)
            .millisecond(0);
          if (next9.isBefore(moment(now).tz(tz))) next9.add(1, "day");
          r.scheduledTime = next9.toDate();
          await r.save();
          continue;
        }

        if (user?.email) {
          await notify({
            to: user.email,
            subject: `TrueLink reminder: ${r.type}`,
            text: `Your reminder: "${r.message}"${
              friend ? ` for ${friend.name}` : ""
            } is due now.`,
          });
        }
        if (friend?.email) {
          await notify({
            to: friend.email,
            subject: `${user.firstName} sent you a message`,
            text: `${user.firstName} : "${r.message}"`,
          });
        }

        r.completed = true;
        await r.save();
      }
    } catch (err) {
      console.error("[CRON ERROR]", err.message);
    }
  });

  cron.schedule("*/5 * * * *", async () => {
    try {
      const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
      const result = await Remainder.deleteMany({
        completed: true,
        scheduledTime: { $lte: fiveMinsAgo },
      });
      if (result.deletedCount > 0) {
        console.log(
          `[CRON CLEANUP] Deleted ${result.deletedCount} completed/expired reminders`
        );
      }
    } catch (err) {
      console.error("[CRON CLEANUP ERROR]", err.message);
    }
  });
}

const CRON_EXPRESSION = "* * * * *";
const DUE_WINDOW_MINUTES = 2; 

function computeLastDueOccurrence(ritual, tz, nowTz, preferredHour) {
  const freq = ritual.frequency || "daily";
  const unit =
    freq === "daily" ? "days" : freq === "weekly" ? "weeks" : "months";

  const lastSent = ritual.lastSentAt ? moment.tz(ritual.lastSentAt, tz) : null;
  const base = lastSent || moment.tz(ritual.createdAt, tz);

  let candidate = base
    .clone()
    .hour(preferredHour)
    .minute(0)
    .second(0)
    .millisecond(0);

  if (candidate.isAfter(base)) {
    if (!candidate.isAfter(nowTz)) {
      return candidate;
    }
    return null;
  }

  candidate.add(1, unit);

  if (candidate.isAfter(nowTz)) return null;

  while (candidate.isSameOrBefore(nowTz)) {
    candidate.add(1, unit);
  }

  const lastDue = candidate.clone().subtract(1, unit);

  if (lastDue.isAfter(base)) return lastDue;

  return null;
}


export function startRitualScheduler() {
  cron.schedule(CRON_EXPRESSION, async () => {
    try {
      const nowUtc = moment.utc();
      const rituals = await Ritual.find({}).populate("to from").exec();

      for (const ritual of rituals) {
        const toUser = ritual.to;
        if (!toUser || !toUser.email) continue;

        const tz = toUser.timezone || "UTC";
        const nowTz = moment.tz(tz);
        const preferredHour = Number.isInteger(ritual.preferredHour)
          ? ritual.preferredHour
          : 9;

        const lastDue = computeLastDueOccurrence(
          ritual,
          tz,
          nowTz,
          preferredHour
        );
        if (!lastDue) continue;

        const minutesSinceScheduled = nowTz.diff(lastDue, "minutes");
        if (
          minutesSinceScheduled < 0 ||
          minutesSinceScheduled >= DUE_WINDOW_MINUTES
        ) {
          continue;
        }

        if (ritual.lastSentAt) {
          const lastSentTz = moment.tz(ritual.lastSentAt, tz);
          if (!lastDue.isAfter(lastSentTz)) {
            continue;
          }
        }

        const subject = `TrueLink: Ritual — ${ritual.name}`;
        const text =
          ritual.description ||
          ritual.template ||
          `It's time for your ritual: ${
            ritual.name
          }. Send a thoughtful note to ${toUser.firstName || toUser.email}.`;

        try {
          await notify({ to: toUser.email, subject, text });

          const lastDueUtc = lastDue.clone().utc().toDate();
          await Ritual.findByIdAndUpdate(ritual._id, {
            lastSentAt: lastDueUtc,
          }).exec();

          console.log(
            `[RITUAL SENT] ritual=${ritual._id} to=${
              toUser.email
            } at=${lastDueUtc.toISOString()} (tz=${tz})`
          );
        } catch (err) {
          console.error(
            `[RITUAL SEND ERROR] ritual=${ritual._id} to=${toUser.email}`,
            err.message
          );
        }
      }
    } catch (err) {
      console.error("[RITUAL SCHEDULER ERROR]", err);
    }
  });

  console.log("Ritual scheduler started (checks every minute).");
}

export { startReminderScheduler };
