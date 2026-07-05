const propertyController = require('./propertyController');
const bookingController = require('./bookingController');

module.exports = {
  ...propertyController,
  ...bookingController
};
