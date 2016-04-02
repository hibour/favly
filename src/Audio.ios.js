'use strict';

/**
 * This module is a thin layer over the native module. It's aim is to obscure
 * implementation details for registering callbacks, changing settings, etc.
*/

var React, {NativeModules, NativeAppEventEmitter, DeviceEventEmitter} = require('react-native');

var AudioPlayerManager = NativeModules.AudioPlayerManager;
var AudioRecorderManager = NativeModules.AudioRecorderManager;
var AudioMixingManager = NativeModules.AudioMixingManager;

var AudioPlayer = {
  play: function(path, options) {
    var playbackOptions = null;

    if (!options) {
      playbackOptions = {
        sessionCategory: 'SoloAmbient'
      };
    } else {
      playbackOptions = options;
    }
    AudioPlayerManager.play(path, playbackOptions);
  },
  playWithUrl: function(url, options) {
    var playbackOptions = null;
    if (!options) {
      playbackOptions = {
        sessionCategory: 'SoloAmbient'
      };
    } else {
      playbackOptions = options;
    }
    AudioPlayerManager.playWithUrl(url, playbackOptions);
  },
  pause: function() {
    AudioPlayerManager.pause();
  },
  unpause: function() {
    AudioPlayerManager.unpause();
  },
  stop: function() {
    AudioPlayerManager.stop();
  },
  setCurrentTime: function(time) {
    AudioPlayerManager.setCurrentTime(time);
  },
  skipToSeconds: function(position) {
    AudioPlayerManager.skipToSeconds(position);
  },

  setStartSubscription: function() {
    if (this.startSubscription) this.startSubscription.remove();
    this.startSubscription = DeviceEventEmitter.addListener('playerStarted',
      (data) => {
        if (this.onStart) {
          this.onStart(data);
        }
      }
    );
  },
  setProgressSubscription: function() {
    if (this.progressSubscription) this.progressSubscription.remove();
    this.progressSubscription = DeviceEventEmitter.addListener('playerProgress',
      (data) => {
        if (this.onProgress) {
          data.currentDuration = data.currentDuration * 1000;
          data.currentTime = data.currentTime * 1000;
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
    AudioPlayerManager.getDuration((error, duration) => {
      callback(duration * 1000);
    })
  },
  getCurrentTime: function(callback) {
    AudioPlayerManager.getCurrentTime((error, currentTime) => {
      callback(currentTime * 1000);
    })
  },
  onStart: null,
  onFinished: null,
  onProgress: null,
};

var AudioRecorder = {
  prepareRecordingAtPath: function(path, options) {

    var recordingOptions = null;

    if (!options) {
      recordingOptions = {
        SampleRate: 44100.0,
        Channels: 2,
        AudioQuality: 'High'
      };
    } else {
      recordingOptions = options;
    }

    AudioRecorderManager.prepareRecordingAtPath(
      path,
      recordingOptions.SampleRate,
      recordingOptions.Channels,
      recordingOptions.AudioQuality
    );

    if (this.progressSubscription) this.progressSubscription.remove();
    this.progressSubscription = NativeAppEventEmitter.addListener('recordingProgress',
      (data) => {
        if (this.onProgress) {
          this.onProgress(data);
        }
      }
    );

    if (this.finishedSubscription) this.finishedSubscription.remove();
    this.finishedSubscription = NativeAppEventEmitter.addListener('recordingFinished',
      (data) => {
        if (this.onFinished) {
          // Strip off file://
          if (data.audioFileURL) {
            data.audioFileURL = data.audioFileURL.substring(7);
          }
          this.onFinished(data);
        }
      }
    );
  },
  startRecording: function() {
    AudioRecorderManager.startRecording();
    if (this.onStart) {
      this.onStart(null);
    }
  },
  pauseRecording: function() {
    AudioRecorderManager.pauseRecording();
  },
  stopRecording: function() {
    AudioRecorderManager.stopRecording();
  },
  playRecording: function() {
    AudioRecorderManager.playRecording();
  },
  stopPlaying: function() {
    AudioRecorderManager.stopPlaying();
  }
};

var AudioMixer = {
  mixAudio: function(path1, path2, periods, path3, callback) {
    AudioMixingManager.mixAudio(path1, path2, periods, path3, (error, success) => {
      if (callback) {
        var result = {result: success, audioFileURL: path3};
        callback(error, result);
      }
    })
  }
}

module.exports = {AudioPlayer, AudioRecorder, AudioMixer};
