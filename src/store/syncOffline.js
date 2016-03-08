const offline = require('react-native-simple-store')

module.exports = function(store) {
  let currentSongs
  let currentRecordings

  store.subscribe(() => {
    const { songList } = store.getState().songs
    const { recordings } = store.getState().recordings;

    if (currentSongs != songList) {
      console.log(">>> Saving Songs to disk ", songList.length);
      offline.save('songList', songList)
      currentSongs = songList
    }

    if (currentRecordings != recordings) {
      console.log(">>> Saving Recording to disk ", recordings.length);
      offline.save('recordings', recordings)
      currentRecordings = recordings
    }

  })
}
