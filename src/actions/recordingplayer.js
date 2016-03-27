var { AudioPlayer } = require('../Audio');

var actions = exports = module.exports

exports.CHANGE_RECORDING = 'CHANGE_RECORDING'
exports.REFRESH_RECORDING = 'REFRESH_RECORDING'
exports.START_RECORDING_PLAYBACK = 'START_RECORDING_PLAYBACK'
exports.PAUSE_RECORDING_PLAYBACK = 'PAUSE_RECORDING_PLAYBACK'
exports.STOP_RECORDING_PLAYBACK = 'STOP_RECORDING_PLAYBACK'
exports.SET_RECORDING_CURRENT_TIME = 'SET_RECORDING_CURRENT_TIME'

exports.changeRecording = function(recording) {
  return {
    type: actions.CHANGE_RECORDING,
    recording: recording
  }
}

exports.startRecordingPlayback = function() {
  return (dispatch, getState) => {
    var recordingplayer = getState().recordingplayer;
    var recording = recordingplayer.currentRecording;
    if (recording) {
      AudioPlayer.play(recording.path, {sessionCategory: 'Playback'});
      AudioPlayer.onProgress = (data) => {
        dispatch({
          type: actions.SET_RECORDING_CURRENT_TIME,
          duration: data.currentDuration * 1000,
          time: data.currentTime * 1000
        })
      };
      AudioPlayer.onFinished = (data) => {
        actions.pauseRecordingPlayback();
      };
      AudioPlayer.setProgressSubscription();
      AudioPlayer.setFinishedSubscription();
      dispatch({
        type: actions.START_RECORDING_PLAYBACK
      });
    }
  };
}

exports.pauseRecordingPlayback = function() {
  return (dispatch, getState) => {
    var recordingplayer = getState().recordingplayer;
    if (recordingplayer.isPlaying) {
      AudioPlayer.pause();
      dispatch({
        type: actions.PAUSE_RECORDING_PLAYBACK
      });
    }
  };
}

exports.stopRecordingPlayback = function() {
  return (dispatch, getState) => {
    var recordingplayer = getState().recordingplayer;
    if (recordingplayer.isPlaying) {
      AudioPlayer.stop();
      dispatch({
        type: actions.STOP_RECORDING_PLAYBACK
      });
    }
  }
}
