const {
  CHANGE_RECORDING,
  PLAY_RECORDING,
  PAUSE_RECORDING,
  SET_RECORDING_CURRENT_TIME
} = require('../actions/recordingplayer')

const initialState = {
  isPlaying: false,
  currentRecording: null,
  currentTime: 0,
  currentDuration: 0,
}

const recordingplayer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_RECORDING:
      return {
        ...state,
        currentRecording: action.recording,
        currentTime: 0,
        currentDuration: 0,
      }
    case PLAY_RECORDING:
      return {
        ...state,
        isPlaying: true,
      }

    case PAUSE_RECORDING:
      return {
        ...state,
        isPlaying: false,
      }

    case SET_RECORDING_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.time,
        currentDuration: action.duration
      }
    default:
      return state
  }
}

module.exports = recordingplayer;
