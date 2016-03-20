'use strict';

var { NativeModules } = require('react-native');
var ShareModule = NativeModules.ShareModule;

var RNShare = {
  open: function(options) {
  	ShareModule.open(options);
  }
};

module.exports = RNShare;
