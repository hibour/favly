var { Platform } = require('react-native');
import RNFS from 'react-native-fs';
var Constants = {
  isProduction: true,

  BASEURL: 'http://localhost:8080',
  CDNURL: 'http://localhost:8080',

  PRODBASEURL: 'https://kuhu-1270.appspot.com',
  PRODCDNURL: 'https://kuhu-1270.appspot.com',

  getRestUrl: function(path) {
    if (isProduction) {
      return this.PRODBASEURL + path;
    }
    return this.BASEURL + path;
  },
  getCDNUrl: function(path) {
    if (isProduction) {
      return this.PRODCDNURL + path;
    }
    return this.CDNURL + path;
  },

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
      return base + '.3gp';
    }
  },

  getFinalRecordPath: function(song, date) {
    var base = song.id + '_' + Math.floor(date.getTime()/1000);
    if (Platform.OS == 'ios') {
      base = RNFS.DocumentDirectoryPath + '/' + base;
      return base + '.m4a';
    } else {
      return base + '.wav';
    }
  },
}
module.exports = Constants;
