'use strict';

/**
 * This module is a thin layer over the native module. It's aim is to obscure
 * implementation details for registering callbacks, changing settings, etc.
*/

var React, {NativeModules, NativeAppEventEmitter, DeviceEventEmitter} = require('react-native');

var AudioPlayerModule = NativeModules.AudioPlayerModule;
var AudioRecorderModule = NativeModules.AudioRecorderModule;
var AudioMixingModule = NativeModules.AudioMixingModule;

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
    AudioRecorderModule.prepare(path);
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
          this.onFinished(data);
        }
      }
    );
  },
  startRecording: function() {
    AudioRecorderModule.startRecording();
  },
  pauseRecording: function() {
    AudioRecorderModule.pauseRecording();
  },
  stopRecording: function() {
    AudioRecorderModule.stopRecording();
  },

  playRecording: function() {
  },
  stopPlaying: function() {
  }
};

var AudioMixer = {
  mixAudio: function(path1, path2, path3, callback) {
    // Mixing
    // atrim=start=0.25
    AudioMixingModule.mixAudio(" -i " + path1 + " -i " + path2 +
    " -filter_complex [0:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,volume=0.25[a1];[1:a]aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,volume=1.0[a2];[a1][a2]amerge,pan=stereo:c0<c0+c2:c1<c1+c3[out] -map [out] -c:a pcm_s16le -shortest ", path3, callback);
    // Smoothing
    // AudioMixingModule.mixAudio(" -i " + path2 +
    // " -af highpass=f=200,lowpass=f=3000 -c:a pcm_s16le -shortest ", path3, callback);
  }
}

module.exports = {AudioPlayer, AudioRecorder, AudioMixer};
