var config = require('../config/global');

module.exports = {
  fullUrl: fullUrl
};

function fullUrl(url, route) {
  return `${config.protocol}://${config.site_name}:${config.port}/${route}${encodeURIComponent(url)}`;
}