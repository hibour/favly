const {
  CHANGE_SONG,
  START_PAUSE_RECORDING,
  STOP_RECORDING,
  TOGGLE_MUTE,
  SET_CURRENT_TIME
} = require('../actions/songplayer')

const initialState = {
  isPlaying: false,
  isRecording: false,
  isMute: false,

  currentSong: {},
  currentTime: 0,
}

const songplayer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SONG:
      return {
        ...state,
        currentSong: action.song
      }
    case START_PAUSE_RECORDING:
      return {
        ...state,
        isPlaying: !state.isPlaying,
        isRecording: true
      }
    case STOP_RECORDING:
      return {
        ...state,
        isPlaying: false,
        isRecording: false
      }
    case TOGGLE_MUTE:
      return {
        ...state,
        isMute: !state.isMute
      }
    case SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.time
      }
    default:
      return state
  }
}

module.exports = songplayer;
