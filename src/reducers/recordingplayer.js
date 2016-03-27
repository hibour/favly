const {
  CHANGE_RECORDING,
  REFRESH_RECORDING,
  START_RECORDING_PLAYBACK,
  PAUSE_RECORDING_PLAYBACK,
  STOP_RECORDING_PLAYBACK,
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

    case REFRESH_RECORDING:
      return {
        ...state,
        currentRecording: action.recording,
      }

    case START_RECORDING_PLAYBACK:
      return {
        ...state,
        isPlaying: true,
      }

    case PAUSE_RECORDING_PLAYBACK:
      return {
        ...state,
        isPlaying: false,
      }

    case STOP_RECORDING_PLAYBACK:
      return {
        ...state,
        currentTime: 0,
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
