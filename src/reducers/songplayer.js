const {
  CHANGE_SONG,
  PLAY_SONG,
  PAUSE_SONG,

  START_RECORDING,
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
  songSound: null,
}

const songplayer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SONG:
      return {
        ...state,
        currentSong: action.song,
        currentTime: 0,
        songSound: null
      }

    case PLAY_SONG:
      return {
        ...state,
        isPlaying: true,
        songSound: action.songSound,
      }

    case PAUSE_SONG:
      return {
        ...state,
        isPlaying: false,
      }

    case START_RECORDING:
      return {
        ...state,
        isRecording: true,
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
