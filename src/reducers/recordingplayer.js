const {
  CHANGE_RECORDING,
  PLAY_PAUSE_RECORDING,
  SET_RECORDING_CURRENT_TIME
} = require('../actions/recordingplayer')

const initialState = {
  isPlaying: false,
  currentRecording: null,
  currentTime: 0,
}

const recordingplayer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_RECORDING:
      return {
        ...state,
        currentRecording: action.recording
      }
    case PLAY_PAUSE_RECORDING:
      return {
        ...state,
        isPlaying: !state.isPlaying,
      }
    case SET_RECORDING_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.time
      }
    default:
      return state
  }
}

module.exports = recordingplayer;
