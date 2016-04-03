const offline = require('react-native-simple-store')

module.exports = function(store) {
  let currentSongs
  let currentRecordings

  store.subscribe(() => {
    const { songList } = store.getState().songs
    const { recordingList } = store.getState().recordings;
    const settings = store.getState().settings;

    if (currentSongs !== undefined && currentSongs != songList) {
      console.log(">>> Saving Songs to disk ", songList.length);
      offline.save('songList', songList)
    }
    currentSongs = songList

    if (currentRecordings !== undefined && currentRecordings != recordingList) {
      console.log(">>> Saving Recordings to disk ", recordingList.length);
      offline.save('recordingList', recordingList)
    }
    offline.save('settings', settings)
    currentRecordings = recordingList
  })
}
