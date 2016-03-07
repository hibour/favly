var actions = exports = module.exports

exports.CHANGE_RECORDING = 'CHANGE_RECORDING'
exports.PLAY_PAUSE_RECORDING = 'PLAY_PAUSE_RECORDING'
exports.SET_RECORDING_CURRENT_TIME = 'SET_RECORDING_CURRENT_TIME'

exports.changeRecording = function changeSong(recording) {
  return {
    type: actions.CHANGE_RECORDING,
    recording: recording
  }
}

exports.playOrPauseRecording = function playOrPauseRecording() {
  return {
    type: actions.PLAY_PAUSE_RECORDING,
  }
}

exports.setRecordingCurrentTime = function setRecordingCurrentTime(time) {
  return {
    type: actions.SET_RECORDING_CURRENT_TIME,
    time: time
  }
}
