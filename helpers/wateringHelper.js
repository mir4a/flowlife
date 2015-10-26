module.exports = {
  nextWateringTime: nextWateringTime
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