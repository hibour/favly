var { Platform } = require('react-native');
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
    var base = '/' + song.id;
    if (Platform.OS == 'ios') {
      return  base + '.caf';
    } else {
      return base + '.m4a';
    }
  },

  getFinalRecordPath: function(song, date) {
    var songDir = RNFS.CachesDirectoryPath + '/';
    var base = songDir + song.id + '_' + Math.floor(date.getTime()/1000);
    if (Platform.OS == 'ios') {
      return base + '.m4a';
    } else {
      return base + '.wav';
    }
  },
}
module.exports = Constants;
