const {
  CHANGE_SONG,

  REFRESH_SONG,
  PLAY_SONG,
  PAUSE_SONG,

  START_RECORDING,
  STOP_RECORDING,
  TOGGLE_MUTE,
  SET_CURRENT_TIME
} = require('../actions/songplayer')
var LRC = require('../utils/lrc')

const initialState = {
  isPlaying: false,
  isRecording: false,
  isMute: false,

  currentSong: {},
  currentTime: 0,
  currentDuration: 0,
  currentLyricIndex: 0,
  currentLRCPlayer: null,
}

const songplayer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_SONG:
      var lrcPlayer = null;
      var song = action.song;
      if (song.lyricsData) {
        lrcPlayer = new LRC.Lrc(song.lyricsData);
      }
      return {
        ...state,
        currentSong: song,
        currentTime: 0,
        currentDuration: 0,
        currentLyricIndex: 0,
        currentLRCPlayer: lrcPlayer,
      }

    case REFRESH_SONG:
      var song = action.song;
      if (state.currentSong.id != song.id) {
        return state;
      }
      var lrcPlayer = state.currentLRCPlayer;
      if (!lrcPlayer && song.lyricsData) {
        lrcPlayer = new LRC.Lrc(song.lyricsData);
      }
      return {
        ...state,
        currentSong: song,
        currentLRCPlayer: lrcPlayer,
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
      var highlightLine = 0;
      if (state.currentLRCPlayer) {
        highlightLine = Math.max(state.currentLRCPlayer.findLineAt(time) - 1, 0);
      }
      return {
        ...state,
        currentTime: time,
        currentDuration: duration,
        currentLyricIndex: highlightLine,
      }
    default:
      return state
  }
}

module.exports = songplayer;
