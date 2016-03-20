var offline = require('react-native-simple-store')
import Constants from '../utils/constants.js'
const Firebase = require('firebase');

import Cache from '../utils/Cache';
import SongPlayerActions from './songplayer'

var actions = exports = module.exports

exports.OFFLINE_SONGS_LOADED = 'OFFLINE_SONGS_LOADED'
exports.ONLINE_SONGS_LOADED = 'ONLINE_SONGS_LOADED'

exports.DOWNLOADING_SONG_ASSETS = 'DOWNLOADING_SONG_ASSETS'
exports.UPDATE_DOWNLOAD_PROGRESS = 'UPDATE_DOWNLOAD_PROGRESS'
exports.DOWNLOAD_COMPLETE = 'DOWNLOAD_COMPLETE'


exports.loadOfflineSongs = function loadOfflineSongs() {
  return dispatch => {
    offline.get('songList').then(songs => {
      dispatch({
        type: actions.OFFLINE_SONGS_LOADED,
        songs: songs || []
      })
    })
  }
}

exports.loadOnlineSongs = function loadOnlineSongs() {
  return dispatch => {
    var database = new Firebase(Constants.FIREBASEURL + "songs");
    database.on('value', (snap) => {
      var songs = [];
      snap.forEach((child) => {
        songs.push({
          title: child.val().title,
          album: child.val().album,
          year: child.val().year,
          thumbnail: child.val().thumbnail,
          track: child.val().track,
          lyrics: child.val().lyrics,
          version: child.val().version,
          id: child.key()
        })
      });
      dispatch({
        type: actions.ONLINE_SONGS_LOADED,
        songs: songs || []
      })
    })
  }
}

function dispatchSongUpdates(dispatch, action, refreshCurrentSong, getState) {
  dispatch(action);
  if (refreshCurrentSong) {
    var state = getState();
    var song = state.songs.songs[action.id];
    dispatch({type: SongPlayerActions.REFRESH_SONG, song: song});
  }
}

exports.downloadSong = function downloadSong(song) {
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
    Cache.getMedia(songPath, song.track, function(data) {
      dispatchSongUpdates(dispatch, {
        type: actions.UPDATE_DOWNLOAD_PROGRESS,
        id: song.id,
        progress: 95,
      }, isCurrentSong, getState)
      var lyricPath = Constants.getLyricPath(song);
      Cache.getText(lyricPath, song.lyrics, function(data) {
        dispatchSongUpdates(dispatch, {
          type: actions.DOWNLOAD_COMPLETE,
          id: song.id,
          lyricsData: data
        }, isCurrentSong, getState)
      });
    });
  }
}
