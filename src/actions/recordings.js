var offline = require('react-native-simple-store')

var actions = exports = module.exports

exports.OFFLINE_RECORDINGS_LOADED = 'OFFLINE_SONGS_LOADED'
exports.ADD_RECORDING = 'ADD_RECORDING'
exports.REMOVE_RECORDING = 'REMOVE_RECORDING'

exports.loadOfflineRecordings = function loadOfflineRecordings() {
  return dispatch => {
    offline.get('recordings').then(recordings => {
      dispatch({
        type: actions.OFFLINE_RECORDINGS_LOADED,
        recordings: recordings || []
      })
    })
  }
}

exports.removeRecording = function removeItem(id) {
  return {
    type: actions.REMOVE_RECORDING,
    id: id
  }
}
