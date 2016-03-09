'use strict';

/**
 * This module is a thin layer over the native module. It's aim is to obscure
 * implementation details for registering callbacks, changing settings, etc.
*/

var React, {NativeModules, NativeAppEventEmitter, DeviceEventEmitter} = require('react-native');

var AudioPlayer = {
  play: function(path, options) {
  },
  playWithUrl: function(url, options) {
  },
  pause: function() {
  },
  unpause: function() {
  },
  stop: function() {
  },
  setCurrentTime: function(time) {
  },
  skipToSeconds: function(position) {
  },
  setProgressSubscription: function() {
  },
  setFinishedSubscription: function() {
  },
  getDuration: function(callback) {
  },
  getCurrentTime: function(callback) {
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
