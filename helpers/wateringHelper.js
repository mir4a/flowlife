module.exports = {
  nextWateringTime: nextWateringTime,
  nextWateringInMilliseconds: nextWateringInMillisecondsFromNow
};

/**
 * Returns date in UTC string format for next watering
 * @param lastUpdate
 * @param interval
 * @returns {string}
 */
function nextWateringTime(lastUpdate, interval) {
  var wateringDate = new Date(lastUpdate);
  wateringDate.setDate(wateringDate.getDate() + interval);
  return wateringDate.toUTCString();
}

function nextWateringInMillisecondsFromNow(nextWateringDate) {
  var wateringDate = new Date(nextWateringDate),
      dateNow = Date.now();
  return wateringDate.getTime() - dateNow;
}