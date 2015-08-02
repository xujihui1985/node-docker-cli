'use strict';

const _ = require('lodash');

exports.composeUrl = _.curry(function _composeUrl(baseUrl, pathname) {
  return [baseUrl].concat(pathname);
});

exports.retry = function(times, interval, fn) {
  
}
