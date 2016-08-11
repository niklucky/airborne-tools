'use strict';

module.exports = {
  toSingular: function toSingular() {
    var string = arguments.length <= 0 || arguments[0] === undefined ? undefined.controller : arguments[0];

    var last = string.length - 1;
    if (string[last] === 's') {
      return string.substring(0, last);
    }
    return string;
  },
  camelCaseToDashes: function camelCaseToDashes(string) {
    var str = string.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) {
      return str.toUpperCase();
    });
    var strArray = str.split(' ');

    var dashed = [];
    strArray.map(function (item) {
      if (item) {
        dashed.push(item.toLowerCase());
      }
    });
    return dashed.join('-');
  },

  firstLower: function firstLower(string) {
    return string[0].toLowerCase() + string.substring(1, string.length);
  }
};