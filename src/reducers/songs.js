const {
  OFFLINE_SONGS_LOADED,
  ONLINE_SONGS_LOADED,

  DOWNLOADING_SONG_ASSETS,
  UPDATE_DOWNLOAD_PROGRESS,
  DOWNLOAD_COMPLETE
} = require('../actions/songs')

const initialState = {
  songs: {},
  songList: []
}

const songInitialState = {
  id: '',
  title: 'Unknown',
  album: 'Unknown',
  year: 'Unknown',
  track: '',
  lyrics: '',
  version: 0,

  lyricsData: null,
  lrcPlayer: null,

  isLoaded: false,
  isDownloading: false,
  downloadProgress: 0,
}

function song(state = songInitialState, action) {
  switch (action.type) {
    case 'ADD_LOCAL_SONG':
      var song = action.song;
      if (state.id) {
        return {
          ...state,
          isLoaded: song.isLoaded,
          lyricsData: song.lyricsData
        }
      } else {
        return song;
      }

    case 'ADD_SERVER_SONG':
    var song = action.song;
      if (state.version != song.version) {
        return song;
      } else {
        return {
          ...state,
          id: song.id,
          title: song.title,
          album: song.album,
          year: song.year,
          thumbnail: song.thumbnail,
          track: song.track,
          lyrics: song.lyrics,
          version: song.version
        }
      }

    case DOWNLOADING_SONG_ASSETS:
      if (state.id !== action.id) {
        return state
      }
      return {
        ...state,
        isDownloading: true,
        isLoaded: false,
        downloadProgress: 0
      };

    case UPDATE_DOWNLOAD_PROGRESS:
      if (state.id !== action.id) {
        return state
      }
      return {
        ...state,
        downloadProgress: action.progress
      }

    case DOWNLOAD_COMPLETE:
      if (state.id !== action.id) {
        return state
      }
      return {
        ...state,
        isDownloading: false,
        isLoaded: true,
        downloadProgress: 100,
        lyricsData: action.lyricsData
      }
    default:
      return state
  }
}

function songs(state = initialState, action) {
  switch (action.type) {
    case OFFLINE_SONGS_LOADED:
      if (!action.songs) {
        return state;
      }
      var songs = Object.assign({}, state.songs);
      action.songs.forEach((songItem) => {
          songs[songItem.id] = song(songs[songItem.id],
            {type: 'ADD_LOCAL_SONG', song: songItem});
      });
      var songList = Object.keys(songs).map((key) => {return songs[key]});

      return {
        ...state,
        songs: songs,
        songList: songList
      }

    case ONLINE_SONGS_LOADED:
      if (!action.songs) {
        return state;
      }
      var songs = Object.assign({}, state.songs);
      action.songs.forEach((songItem) => {
        songs[songItem.id] = song(songs[songItem.id],
          {type: 'ADD_SERVER_SONG', song: songItem});
      });
      var songList = Object.keys(songs).map((key) => {return songs[key]});

      return {
        ...state,
        songs: songs,
        songList: songList
      }

    case DOWNLOADING_SONG_ASSETS:
    case UPDATE_DOWNLOAD_PROGRESS:
    case DOWNLOAD_COMPLETE:
      var songs = Object.assign({}, state.songs);
      songs[action.id] = song(songs[action.id], action);
      var songList = Object.keys(songs).map((key) => {return songs[key]});
      return {
        ...state,
        songs: songs,
        songList: songList
      }

    default:
      return state
  }
}

module.exports = songs;
