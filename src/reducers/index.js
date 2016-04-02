const { combineReducers } = require('redux')
import home from './home'
import recordings from './recordings'
import songs from './songs'
import routes from './routes'
import songplayer from './songplayer'
import recordingplayer from './recordingplayer'
import settings from './settings'

const rootReducer = combineReducers({
  home,
  settings,
  routes,
  songs,
  recordings,
  songplayer,
  recordingplayer,
})

module.exports = rootReducer
