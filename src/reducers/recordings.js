const {
  OFFLINE_RECORDINGS_LOADED,
  ADD_RECORDING,
  DELETE_RECORDING,
} = require('../actions/recordings')
import moment from 'moment'

const initialState = {
  recordings: {},
  recordingList: [],
  songToRecordingMapping: {},
  maxId: Math.round(new Date().getTime()/1000.0)
}

const comparator = function(recording1, recording2) {
  return recording2.momentTime.diff(recording1.momentTime);
}

const addRecording = (recordings, mapping, recording) => {
  recordings[recording.id] = recording;
  if (!mapping[recording.songid]) {
    mapping[recording.songid] = [];
  }
  mapping[recording.songid].push(recording);
}
const getRecordingListFromMap = (recordings) => {
  var recordingList = Object.keys(recordings).map((key) => {return recordings[key]});
  return recordingList.sort(comparator);
}
const removeElementFromList = (list, element) => {
  var i = list.indexOf(element);
  if(i != -1) {
  	list.splice(i, 1);
  }
}

const recording = (state, action) => {
  switch (action.type) {
    case ADD_RECORDING:
      return {
        id: action.id,
        title: action.recording.title,
        songid: action.recording.songid,

        path: action.recording.path,
        time: action.recording.time,
        momentTime: moment(action.recording.time),

        album: action.recording.album,
        thumbnail: action.recording.thumbnail,
      }
    default:
      return state
  }
}

const recordings = (state = initialState, action) => {
  switch (action.type) {
    case ADD_RECORDING:
      action.id = state.maxId;
      var recordings = Object.assign({}, state.recordings);
      var recordingList = Object.assign({}, state.recordingList);
      var songToRecordingMapping = Object.assign({}, state.songToRecordingMapping);

      addRecording(recordings, songToRecordingMapping, recording(undefined, action));

      return {
        ...state,
        maxId: state.maxId + 1,
        recordings: recordings,
        songToRecordingMapping: songToRecordingMapping,
        recordingList: getRecordingListFromMap(recordings),
      }

    case OFFLINE_RECORDINGS_LOADED:
      var recordings = Object.assign({}, state.recordings);
      var songToRecordingMapping = Object.assign({}, state.songToRecordingMapping);

      var recordingList = action.recordingList || [];
      recordingList.forEach((recordingItem) => {
        recordingItem.momentTime = moment(recordingItem.time);
      });

      recordingList = recordingList.sort(comparator);
      recordingList.forEach((recordingItem) => {
        addRecording(recordings, songToRecordingMapping, recordingItem);
      });

      return {
        ...state,
        recordings: recordings,
        songToRecordingMapping: songToRecordingMapping,
        recordingList: recordingList,
      }

    case DELETE_RECORDING:
      var recordings = Object.assign({}, state.recordings);
      var recordingList = Object.assign({}, state.recordingList);
      var songToRecordingMapping = Object.assign({}, state.songToRecordingMapping);

      var recordingItem = recordings[action.id];
      if (!recordingItem) {
        return state;
      }

      delete recordings[recordingItem.id];
      removeElementFromList(songToRecordingMapping[recordingItem.songid], recordingItem);

      return {
        ...state,
        recordings: recordings,
        songToRecordingMapping: songToRecordingMapping,
        recordingList: getRecordingListFromMap(recordings),
      }

    default:
      return state
  }
}

module.exports = recordings;
