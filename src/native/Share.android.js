'use strict';

var { NativeModules } = require('react-native');
var ShareModule = NativeModules.ShareModule;

var RNShare = {
  open: function(options) {
  	ShareModule.open(options, (result) => {
      console.log(">>> Share result is ", result);
    });
  }
};

module.exports = RNShare;
