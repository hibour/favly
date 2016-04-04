var offline = require('react-native-simple-store')
import Constants from '../utils/constants.js'

import Cache from '../utils/Cache';
import SongPlayerActions from './songplayer'

var actions = exports = module.exports

exports.OFFLINE_SONGS_LOADED = 'OFFLINE_SONGS_LOADED'
exports.ONLINE_SONGS_LOADED = 'ONLINE_SONGS_LOADED'

exports.DOWNLOADING_SONG_ASSETS = 'DOWNLOADING_SONG_ASSETS'
exports.UPDATE_DOWNLOAD_PROGRESS = 'UPDATE_DOWNLOAD_PROGRESS'
exports.DOWNLOAD_COMPLETE = 'DOWNLOAD_COMPLETE'
exports.SEARCH_SONGS = 'SEARCH_SONGS'

exports.loadOfflineSongs = function() {
  return dispatch => {
    offline.get('songList').then(songs => {
      dispatch({
        type: actions.OFFLINE_SONGS_LOADED,
        songs: songs || []
      })
    })
  }
}

exports.loadOnlineSongs = function() {
  return dispatch => {
    fetch(Constants.getRestUrl('/rest/first'))
    .then((response) => response.json())
    .then((response) => {
      dispatch({
        type: actions.ONLINE_SONGS_LOADED,
        songs: response.songs || []
      });
    })
    .catch((error) => {
      console.warn(error);
    });
  }
}

function dispatchSongUpdates(dispatch, action, refreshCurrentSong, getState) {
  dispatch(action);
  if (refreshCurrentSong) {
    var state = getState();
    var song = state.songs.songs[action.id];
    var locale = state.settings.locale;
    dispatch({type: SongPlayerActions.REFRESH_SONG, song: song, locale: locale});
  }
}

exports.downloadSong = function(song) {
  return (dispatch, getState) => {
    // If it is already loaded.
    if (song.isLoaded && song.lyricsData) {
      return;
    }

    var songplayer = getState().songplayer;
    var isCurrentSong = songplayer.currentSong.id == song.id;

    dispatchSongUpdates(dispatch, {
      type: actions.DOWNLOADING_SONG_ASSETS,
      id: song.id
    }, isCurrentSong, getState);

    var songPath = Constants.getSongPath(song);
    Cache.getMedia(songPath, Constants.getCDNUrl(song.track), function(data) {
      dispatchSongUpdates(dispatch, {
        type: actions.UPDATE_DOWNLOAD_PROGRESS,
        id: song.id,
        progress: 90,
      }, isCurrentSong, getState)
      var lyricPath = Constants.getLyricPath(song);
      Cache.getText(lyricPath, Constants.getCDNUrl(song.lyrics), function(data) {
        // Parse Lyric Data
        var localeToLyricMap = {};
        var localeLyrics = data.split(/LOCALE:(\w+)\n/)
        var i = 1;
        while (i < localeLyrics.length) {
          localeToLyricMap[localeLyrics[i]] = localeLyrics[i+1];
          i = i + 2;
        }

        dispatchSongUpdates(dispatch, {
          type: actions.DOWNLOAD_COMPLETE,
          id: song.id,
          lyricsData: localeToLyricMap
        }, isCurrentSong, getState)
      });
    });
  }
}

exports.searchSongs = function(searchTerm) {
  return (dispatch, getState) => {
    var songs = getState().songs.songList;
    var filteredSongs = songs.filter((song) => {
      return song.title.indexOf(searchTerm) || song.album.indexOf(searchTerm);
    })
    dispatch({
      type: actions.SEARCH_SONGS,
      songs: filteredSongs
    })
  }
}
