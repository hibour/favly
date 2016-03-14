var { AudioPlayer } = require('../Audio');

var actions = exports = module.exports

exports.CHANGE_RECORDING = 'CHANGE_RECORDING'
exports.PLAY_RECORDING = 'PLAY_RECORDING'
exports.PAUSE_RECORDING = 'PAUSE_RECORDING'
exports.SET_RECORDING_CURRENT_TIME = 'SET_RECORDING_CURRENT_TIME'

exports.changeRecording = function changeRecording(recording) {
  return {
    type: actions.CHANGE_RECORDING,
    recording: recording
  }
}

exports.playRecording = function playRecording() {
  return (dispatch, getState) => {
    var recordingplayer = getState().recordingplayer;
    var recording = recordingplayer.currentRecording;
    if (recording) {
      console.log(">>>> Playing recording from ", recording.path);
      AudioPlayer.play(recording.path, {sessionCategory: 'Playback'});

      AudioPlayer.onProgress = (data) => {
        dispatch({
          type: actions.SET_RECORDING_CURRENT_TIME,
          duration: data.currentDuration * 1000,
          time: data.currentTime * 1000
        })
      };
      AudioPlayer.onFinished = (data) => {
        actions.pauseRecording();
      };
      AudioPlayer.setProgressSubscription();
      AudioPlayer.setFinishedSubscription();
      dispatch({
        type: actions.PLAY_RECORDING
      });
    }
  };
}

exports.pauseRecording = function pauseRecording() {
  return (dispatch, getState) => {
    AudioPlayer.pause();
    dispatch({
      type: actions.PAUSE_RECORDING
    });
  };
}
