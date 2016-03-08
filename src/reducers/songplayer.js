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
  currentDuration: 0,
}

const songplayer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SONG:
      return {
        ...state,
        currentSong: action.song,
        currentTime: 0,
        currentDuration: 0,
      }

    case PLAY_SONG:
      return {
        ...state,
        isPlaying: true
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
      var duration = action.duration || state.currentDuration;
      var time = action.time || state.currentTime;
      return {
        ...state,
        currentTime: time,
        currentDuration: duration
      }
    default:
      return state
  }
}

module.exports = songplayer;
