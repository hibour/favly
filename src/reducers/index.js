const { combineReducers } = require('redux')
const recordings = require('./recordings')
const songs = require('./songs');
const routes = require('./routes');
const songplayer = require('./songplayer');
const recordingplayer = require('./recordingplayer');

const rootReducer = combineReducers({
  songs,
  recordings,
  songplayer,
  recordingplayer,
  routes
})

module.exports = rootReducer