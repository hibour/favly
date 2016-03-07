const {
  OFFLINE_RECORDINGS_LOADED,
  ADD_RECORDING
} = require('../actions/recordings')

const initialState = {
  recordings: [],
  maxId: 0
}

const recording = (state, action) => {
  switch (action.type) {
    case ADD_RECORDING:
      return {
        id: action.id,
        title: action.recording.title,
        songid: action.recording.songid,
        path: action.recording.path,
        time: action.recording.time
      }
    default:
      return state
  }
}

const recordings = (state = initialState, action) => {
  switch (action.type) {
    case ADD_RECORDING:
      action.id = state.maxId;
      var list = state.recordings.concat([recording(undefined, action)]);
      return {
        ...state,
        maxId: state.maxId + 1,
        recordings: list,
      }
    case OFFLINE_RECORDINGS_LOADED:
      return {
        ...state,
        recordings: action.recordings,
      }
    default:
      return state
  }
}

module.exports = recordings;
