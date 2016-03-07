const offline = require('react-native-simple-store')

module.exports = function(store) {
  let currentSongs
  let currentRecordings

  store.subscribe(() => {
    const { onlineSongsLoaded, songs } = store.getState().songs
    const { recordings } = store.getState().recordings;

    if (onlineSongsLoaded && currentSongs != songs) {
      offline.save('songs', songs)
      currentSongs = songs
    }

    if (currentRecordings != recordings) {
      offline.save('recordings', recordings)
      currentRecordings = recordings
    }

  })
}
