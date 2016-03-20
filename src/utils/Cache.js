'use strict';

var RNFS = require('react-native-fs');
var Cache = {

  getText: function(path, url, onSuccess, onFailure) {
    this.getData(path, url, 'utf8', onSuccess, onFailure);
  },

  getMedia: function(path, url, onSuccess, onFailure) {
    this.getData(path, url, 'base64', onSuccess, onFailure);
  },

  getData: function(path, url, encoding, onSuccess, onFailure) {
    RNFS.stat(path).then((statResult) => {
      if (statResult.isFile()) {
        console.log(">>> Found the file at ", path);
        // if we have a file, read it
        return RNFS.readFile(path, encoding);
      } else {
        if (onFailure) {
          try {onFailure(err);} catch(e){}
        }
      }
    })
    .then((contents) => {
      console.log(">>> Successfully read the data at ", path);
      if (onSuccess) {
        try {onSuccess(contents);} catch(e){}
      }
    })
    .catch((err) => {
      console.log(">> Probably file doesnt exist ", err.message);
      this.downloadMedia(path, url, encoding, onSuccess, onFailure);
    })
  },

  downloadMedia: function(path, url, encoding, onSuccess, onFailure) {
    console.log(">> Downloading from ", url);
    RNFS.downloadFile(url, path).then((stateResult) => {
      console.log("Successfully downloaded");
      this.getData(path, url, encoding, onSuccess, onFailure);
    });
  },

  deleteRecording: function(recording, onSuccess, onFailure) {
    RNFS.unlink(recording.path).spread((success, path) => {
      console.log('FILE DELETED', success, path);
      if (onSuccess) {
        onSuccess();
      }
    }).catch((err) => {
      console.log(err.message);
      if (onFailure) {
        onFailure();
      }
    });
  },

  deleteSong: function(song) {
    // TODO Implement this and plugin.
  }

}

module.exports = Cache;
