var offline = require('react-native-simple-store')
import Cache from '../utils/Cache';
import Share from '../Share';

var actions = exports = module.exports

exports.OFFLINE_RECORDINGS_LOADED = 'OFFLINE_SONGS_LOADED'
exports.ADD_RECORDING = 'ADD_RECORDING'
exports.DELETE_RECORDING = 'DELETE_RECORDING'

exports.loadOfflineRecordings = function loadOfflineRecordings() {
  return (dispatch, getState) => {
    if (getState().recordings.loadedOfflineRecordings) {
      return;
    }
    offline.get('recordingList').then(recordingList => {
      dispatch({
        type: actions.OFFLINE_RECORDINGS_LOADED,
        recordingList: recordingList || []
      })
    })
  }
}

exports.deleteRecording = function deleteRecording(id) {
  return (dispatch, getState) => {
    var recordings = getState().recordings.recordings;
    var recording = recordings[id];
    if (recording) {
      Cache.deleteRecording(recording, () => {
        return {
          type: actions.DELETE_RECORDING,
          id: id
        }
      }, () => {
        console.log(">>>> Failed to delete the file");
      });
    } else {
      console.log(">>>> Not found :| ", id);
    }
  };
}

exports.shareRecording = function shareRecording(recording) {
  return (dispatch, getState) => {
    Share.open({title: 'Share Kuhu', share_type: 'audio', share_path: recording.path});
  }
}
