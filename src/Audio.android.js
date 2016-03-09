'use strict';

/**
 * This module is a thin layer over the native module. It's aim is to obscure
 * implementation details for registering callbacks, changing settings, etc.
*/

var React, {NativeModules, NativeAppEventEmitter, DeviceEventEmitter} = require('react-native');

var AudioPlayerModule = NativeModules.AudioPlayerModule;

var AudioPlayer = {
  play: function(path, options) {
    AudioPlayerModule.play(path);
  },
  playWithUrl: function(url, options) {
  },
  pause: function() {
    AudioPlayerModule.pause();
  },
  unpause: function() {
    AudioPlayerModule.unpause();
  },
  stop: function() {
    AudioPlayerModule.stop();
  },
  setCurrentTime: function(time) {
    AudioPlayerModule.setCurrentTime(time);
  },
  skipToSeconds: function(position) {
    AudioPlayerModule.setCurrentTime(position);
  },
  setProgressSubscription: function() {
    if (this.progressSubscription) this.progressSubscription.remove();
    this.progressSubscription = DeviceEventEmitter.addListener('playerProgress',
      (data) => {
        if (this.onProgress) {
          this.onProgress(data);
        }
      }
    );
  },
  setFinishedSubscription: function() {
    if (this.finishedSubscription) this.finishedSubscription.remove();
    this.finishedSubscription = DeviceEventEmitter.addListener('playerFinished',
      (data) => {
        if (this.onFinished) {
          this.onFinished(data);
        }
      }
    );
  },
  getDuration: function(callback) {
    AudioPlayerModule.getDuration(callback);
  },
  getCurrentTime: function(callback) {
    AudioPlayerModule.getCurrentTime(callback);
  },
};

var AudioRecorder = {
  prepareRecordingAtPath: function(path, options) {
  },
  startRecording: function() {
  },
  pauseRecording: function() {
  },
  stopRecording: function() {
  },
  
  playRecording: function() {
  },
  stopPlaying: function() {
  }
};

var AudioMixer = {
  mixAudio: function(path1, path2, path3, callback) {
  }
}

module.exports = {AudioPlayer, AudioRecorder, AudioMixer};
