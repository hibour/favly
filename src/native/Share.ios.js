'use strict';

var { NativeModules } = require('react-native');

var ShareManager = NativeModules.ShareManager;

var RNShare = {
  open: function(options) {
  	ShareManager.open(options);
  }
};

module.exports = RNShare;
