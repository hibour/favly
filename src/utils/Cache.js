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
    console.log(">>> Trying to get data from ", path);
    RNFS.stat(path).then((statResult) => {
      console.log(">> stat result ", statResult);
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
      console.log(">> Probably file doesnt exist ", err.message, err.code, err);
      this.downloadMedia(path, url, encoding, onSuccess, onFailure);
    })
  },

  downloadMedia: function(path, url, encoding, onSuccess, onFailure) {
    console.log(">> Downloading from ", url);
    RNFS.downloadFile(url, path).then((stateResult) => {
      console.log("Successfully downloaded ?", stateResult);
      this.getData(path, url, encoding, onSuccess, onFailure);
    });
  }
}

module.exports = Cache;
