const {
  OFFLINE_RECORDINGS_LOADED,
  ADD_RECORDING,
  DELETE_RECORDING,
} = require('../actions/recordings')

const initialState = {
  recordings: {},
  recordingList: [],
  songToRecordingMapping: {},
  loadedOfflineRecordings: false,
  maxId: Math.round(new Date().getTime()/1000.0)
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
  recordingList = recordingList.sort(function(a, b){return b.time - a.time});
  return recordingList;
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
      recordingList.sort(function(a, b){return b.time - a.time});
      recordingList.forEach((recordingItem) => {
        addRecording(recordings, songToRecordingMapping, recordingItem);
      });

      return {
        ...state,
        loadedOfflineRecordings: true,
        recordings: recordings,
        songToRecordingMapping: songToRecordingMapping,
        recordingList: recordingList,
      }

    case DELETE_RECORDING:
      var recordings = Object.assign({}, state.recordings);
      delete recordings[action.id];

      var recordingList = Object.keys(recordings).map((key) => {return recordings[key]});
      recordingList.sort(function(a, b){return b.time - a.time});
      return {
        ...state,
        recordings: recordings,
        recordingList: recordingList
      }

    default:
      return state
  }
}

module.exports = recordings;
