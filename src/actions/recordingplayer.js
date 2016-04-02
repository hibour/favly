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

    if (recordingplayer.isActive && recordingplayer.isPlaying) {
      return;
    }

    AudioPlayer.onProgress = (data) => {
      dispatch({
        type: actions.SET_RECORDING_CURRENT_TIME,
        duration: data.currentDuration,
        time: data.currentTime
      })
    }

    if (recordingplayer.isActive) {
      AudioPlayer.unpause();
      dispatch({
        type: actions.START_RECORDING_PLAYBACK
      });
      return;
    }

    var recording = recordingplayer.currentRecording;
    if (recording) {
      AudioPlayer.play(recording.path, {sessionCategory: 'Playback'});
      AudioPlayer.onFinished = (data) => {
        dispatch({
          type: actions.STOP_RECORDING_PLAYBACK
        })
      };
      AudioPlayer.setProgressSubscription();
      AudioPlayer.setFinishedSubscription();
      dispatch({
        type: actions.START_RECORDING_PLAYBACK
      });
    }
  }
}

exports.pauseRecordingPlayback = function() {
  return (dispatch, getState) => {
    var recordingplayer = getState().recordingplayer;
    if (recordingplayer.isActive) {
      AudioPlayer.onProgress = null;
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
    if (recordingplayer.isActive) {
      AudioPlayer.stop();
      dispatch({
        type: actions.STOP_RECORDING_PLAYBACK
      });
    }
  }
}
