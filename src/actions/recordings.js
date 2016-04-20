var offline = require('react-native-simple-store')
import Cache from '../utils/Cache';
import Share from '../native/Share';
import RecordingPlayerActions from './recordingplayer'

var actions = exports = module.exports

exports.OFFLINE_RECORDINGS_LOADED = 'OFFLINE_RECORDINGS_LOADED'
exports.ADD_RECORDING = 'ADD_RECORDING'
exports.DELETE_RECORDING = 'DELETE_RECORDING'

function dispatchRecordingUpdates(dispatch, action, refreshCurrentRecording, getState) {
  dispatch(action);
  if (refreshCurrentRecording) {
    var state = getState();
    var recording = state.recordings.recordings[action.id];
    dispatch({type: RecordingPlayerActions.REFRESH_RECORDING, recording: recording});
  }
}

exports.loadOfflineRecordings = function loadOfflineRecordings() {
  return (dispatch, getState) => {
    if (getState().recordings.loadedOfflineRecordings) {
      return;
    }
    offline.get('recordingList').then(recordingList => {
      dispatchRecordingUpdates(dispatch, {
        type: actions.OFFLINE_RECORDINGS_LOADED,
        recordingList: recordingList || []
      }, false, getState);
    })
  }
}

exports.deleteRecording = function deleteRecording(id) {
  return (dispatch, getState) => {
    var recordings = getState().recordings.recordings;
    var recording = recordings[id];
    if (recording) {
      Cache.deleteRecording(recording, () => {
        dispatchRecordingUpdates(dispatch, {
          type: actions.DELETE_RECORDING,
          id: id
        }, true, getState)
      }, () => {
        console.log(">>>> Failed to delete the file. Assuming that it is already deleted!");
        dispatchRecordingUpdates(dispatch, {
          type: actions.DELETE_RECORDING,
          id: id
        }, true, getState)
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
