var offline = require('react-native-simple-store')
import Constants from '../utils/constants.js'
const Firebase = require('firebase');

var actions = exports = module.exports

exports.OFFLINE_SONGS_LOADED = 'OFFLINE_SONGS_LOADED'
exports.ONLINE_SONGS_LOADED = 'ONLINE_SONGS_LOADED'

exports.loadOfflineSongs = function loadOfflineSongs() {
  return dispatch => {
    offline.get('songs').then(songs => {
      console.log(">>>>>> offline songs are ", songs);
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
          _key: child.key()
        })
      });
      dispatch({
        type: actions.ONLINE_SONGS_LOADED,
        songs: songs || []
      })
    })
  }
}
