var RNFS = require('react-native-fs');
var Constants = {
  FIREBASEURL: 'https://shining-fire-6281.firebaseio.com/',

  getSongPath: function(song) {
    var songDir = RNFS.CachesDirectoryPath + '/' + song.id;
    return songDir + '_v' + song.version + '___song.mp3';
  },
  getLyricPath: function(song) {
    var songDir = RNFS.CachesDirectoryPath + '/' + song.id;
    return songDir + '_v' + song.version + '___lyric.txt';
  },
  getRecordingPath: function(song) {
    return '/' + song.id + '.caf';
  },
  getRecordingAbsolutePath: function(path) {
    return RNFS.DocumentDirectoryPath + path;
  }
}
module.exports = Constants;
