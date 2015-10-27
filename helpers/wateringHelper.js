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
  wateringDate.setDate(wateringDate.getDate() + parseInt(interval));
  var diff = wateringDate.getTime() - Date.now();

  return diff <= 1000*3600*24 ? 1000*60 : diff - 1000*3600*24;
}
