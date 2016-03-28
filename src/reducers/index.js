const { combineReducers } = require('redux')
const home = require('./home')
const recordings = require('./recordings')
const songs = require('./songs')
const routes = require('./routes')
const songplayer = require('./songplayer')
const recordingplayer = require('./recordingplayer')

const rootReducer = combineReducers({
  home,
  routes,
  songs,
  recordings,
  songplayer,
  recordingplayer,
})

module.exports = rootReducer
