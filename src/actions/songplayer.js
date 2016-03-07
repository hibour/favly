var actions = exports = module.exports

exports.CHANGE_SONG = 'CHANGE_SONG'
exports.START_PAUSE_RECORDING = 'START_PAUSE_RECORDING'
exports.STOP_RECORDING = 'STOP_RECORDING'
exports.TOGGLE_MUTE = 'TOGGLE_MUTE'
exports.SET_CURRENT_TIME = 'SET_CURRENT_TIME'

exports.changeSong = function changeSong(song) {
  return {
    type: actions.CHANGE_SONG,
    song: song
  }
}

exports.startOrPauseRecording = function startRecording() {
  return {
    type: actions.START_PAUSE_RECORDING,
  }
}

exports.stopRecording = function stopRecording() {
  return {
    type: actions.STOP_RECORDING
  }
}

exports.toggleMute = function toggleMute() {
  return {
    type: actions.TOGGLE_MUTE
  }
}

exports.setCurrentTime = function setCurrentTime(time) {
  return {
    type: actions.SET_CURRENT_TIME,
    time: time
  }
}
