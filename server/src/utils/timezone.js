import moment from 'moment-timezone';
function isReasonableHour(date, tz = 'UTC', startHour = 9, endHour = 21) {
  const local = moment(date).tz(tz);
  const h = local.hour();
  return h >= startHour && h < endHour; 
}

export { isReasonableHour };
