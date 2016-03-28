const React = require('react-native')
const { StyleSheet, Dimensions } = React
import {constants as CommonConstants} from '../css/common.js'

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  header: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
    flex: 1,
    padding: 4,
  },

  songDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  songLeftDetails: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: CommonConstants.primaryColor,
    textShadowColor: 'black',
    textShadowRadius: 1,
    textShadowOffset: {height: 1, width: 0}
  },
  timers: {
    fontSize: 14,
    fontWeight: 'bold',
    color: CommonConstants.primaryColor,
    textShadowColor: 'black',
    textShadowRadius: 1,
    textShadowOffset: {height: 1, width: 0}
  },

  songRightDetails: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },

  trackAlbum: {
    fontSize: 14,
    fontWeight: 'bold',
    color: CommonConstants.primaryColor,
    textShadowColor: 'black',
    textShadowRadius: 1,
    textShadowOffset: {height: 1, width: 0}
  },
  recordedTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: CommonConstants.primaryColor,
    textShadowColor: 'black',
    textShadowRadius: 1,
    textShadowOffset: {height: 1, width: 0}    
  },


  miniPlayer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },

  playerControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  button: {
    margin: 12,
  },

  progressBar: {
    width: window.width,
  },
  progressBarBackground: {
    backgroundColor: '#cccccc',
  },
  progressBarFill: {
    backgroundColor: 'blue',
  },
})

module.exports = styles
