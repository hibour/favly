'use strict';

var { NativeModules } = require('react-native');

var HeadphonesManager = NativeModules.HeadphonesManager;

var RNHeadphones = {
  isPluggedin: function(callback) {
  	return HeadphonesManager.isPluggedin(function(result){
      if (callback) {
        callback(result);
      }
    });
  },

  setChangeListener: function() {
    if (this.changeSubscription) this.changeSubscription.remove();
    this.changeSubscription = NativeAppEventEmitter.addListener('headphoneStateChange',
      (data) => {
        if (this.onChange) {
          this.onChange(data);
        }
      }
    );
  },
};
HeadphonesManager.initModule();
module.exports = RNHeadphones;
