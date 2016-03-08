var { AudioPlayer } = require('react-native-audio');

var actions = exports = module.exports

exports.CHANGE_RECORDING = 'CHANGE_RECORDING'
exports.PLAY_RECORDING = 'PLAY_RECORDING'
exports.PAUSE_RECORDING = 'PAUSE_RECORDING'
exports.SET_RECORDING_CURRENT_TIME = 'SET_RECORDING_CURRENT_TIME'

exports.changeRecording = function changeSong(recording) {
  return {
    type: actions.CHANGE_RECORDING,
    recording: recording
  }
}

exports.playRecording = function playSong() {
  return (dispatch, getState) => {
    var recordingplayer = getState().recordingplayer;
    var recording = recordingplayer.currentRecording;
    if (recording) {
      console.log(">>>> Playing recording from ", recording.path);
      AudioPlayer.play(recording.path);
      dispatch({
        type: actions.PLAY_RECORDING
      });
    }
  };
}

exports.pauseRecording = function playOrPauseRecording() {
  return (dispatch, getState) => {
    AudioPlayer.pause();
    dispatch({
      type: actions.PAUSE_RECORDING
    });
  };
}

exports.setRecordingCurrentTime = function setRecordingCurrentTime(time) {
  return {
    type: actions.SET_RECORDING_CURRENT_TIME,
    time: time
  }
}
