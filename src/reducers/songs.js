const {
  OFFLINE_SONGS_LOADED,
  ONLINE_SONGS_LOADED
} = require('../actions/songs')

const initialState = {
  songs: [],
  onlineSongsLoaded: false
}

function songs(state = initialState, action) {
  switch (action.type) {
    case OFFLINE_SONGS_LOADED:
      if (!state.onlineSongsLoaded) {
        return {
          ...state,
          songs: action.songs,
        }
      } else {
        return state;
      }

    case ONLINE_SONGS_LOADED:
      return {
        ...state,
        onlineSongsLoaded: true,
        songs: action.songs,
      }
    default:
      return state
  }
}

module.exports = songs;
