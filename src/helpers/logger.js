/*
* Ultra simple logging
*/

var config = require('../config');

module.exports = function(message) {
  if (!_.isUndefined(console) && config.debug) {
    console.log(message);
  }
};
