import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config()
let transporter = null;

function haveEmailConfig() {
  return (
    process.env.SMTP_HOST &&
    process.env.SMTP_PORT &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.FROM_EMAIL
  );
}

function getTransporter() {
  if (!haveEmailConfig()) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
}

async function notify({ to, subject, text }) {
  const t = getTransporter();
  if (!t) {
    console.log(`[NOTIFY] to=${to} subject=${subject} text=${text}`);
    return { ok: true, via: 'console' };
  }
  const info = await t.sendMail({ from: process.env.FROM_EMAIL, to, subject, text });
  return { ok: true, via: 'email', messageId: info.messageId };
}

export { notify };
