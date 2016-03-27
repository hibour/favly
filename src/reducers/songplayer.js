const {
  CHANGE_SONG,

  REFRESH_SONG,
  PLAY_SONG,
  STOP_SONG,

  START_RECORDING,
  PAUSE_RECORDING,
  STOP_RECORDING,

  TOGGLE_MUTE,
  SET_CURRENT_TIME
} = require('../actions/songplayer')
var LRC = require('../utils/lrc')

const initialState = {
  isPlaying: false,
  isRecording: false,
  isActive: false,
  isMute: false,

  currentSong: {},
  currentTime: 0,
  currentDuration: 0,
  currentLyricIndex: -1,
  upcomingLyricIndex: -1,
  currentLRCPlayer: null,

  recordingStartedAt: -1,
  recordingPeriods: [], // {start: 0, end: 0}
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
        ...initialState,
        currentSong: song,
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
        isPlaying: true,
        isActive: true,
      }

    case STOP_SONG:
      return {
        ...state,
        isPlaying: false,
        isActive: false,
      }

    case START_RECORDING:
      return {
        ...state,
        recordingStartedAt: action.time,
        isRecording: true,
        isActive: true,
      }

    case PAUSE_RECORDING:
      var recordingPeriods = Object.assign([], state.recordingPeriods);
      recordingPeriods.push({start: state.recordingStartedAt, end: action.time});
      return {
        ...state,
        recordingStartedAt: -1,
        recordingPeriods: recordingPeriods,
        isRecording: false,
      }

    case STOP_RECORDING:
      var recordingPeriods = Object.assign([], state.recordingPeriods);
      recordingPeriods.push({start: state.recordingStartedAt, end: action.time});
      return {
        ...state,
        recordingStartedAt: -1,
        recordingPeriods: recordingPeriods,
        isRecording: false,
        isActive: false,
      }

    case TOGGLE_MUTE:
      return {
        ...state,
        isMute: !state.isMute
      }

    case SET_CURRENT_TIME:
      var duration = action.duration || state.currentDuration;
      var time = action.time || state.currentTime;
      var highlightLine = -1;
      var upcomingHighlightedLine = -1;
      if (state.currentLRCPlayer) {
        highlightLine = Math.max(state.currentLRCPlayer.findLineAt(time) - 1, 0);
        upcomingHighlightedLine = Math.max(state.currentLRCPlayer.findLineAt(time + 1000) - 1, 0);
      }
      return {
        ...state,
        currentTime: time,
        currentDuration: duration,
        currentLyricIndex: highlightLine,
        upcomingLyricIndex: upcomingHighlightedLine,
      }
    default:
      return state
  }
}

module.exports = songplayer;
