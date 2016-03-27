'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Component,
  InteractionManager,
  Dimensions,
} = React;

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ProgressBar from './ProgressBar'
import SongPlayerActions from '../actions/songplayer'
import RecordingsActions from '../actions/recordings'

import {styles as CommonStyles, constants as CommonConstants} from '../css/common.js';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

class SongPlayer extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var song = this.props.song;
    return (<View style={styles.header}>
              <View style={styles.songDetails}>
                <View style={styles.songLeftDetails}>
                  <Text style={styles.trackTitle}>{song.title}</Text>
                  <Text style={styles.timers}>{this._getSoundTimer()}</Text>
                </View>
                <View style={styles.songRightDetails}>
                  <Text style={styles.trackAlbum}>{song.album}</Text>
                </View>
              </View>
              {this.props.isActive ? this.playingControls() : this.initialPlayControls()}
            </View>);
  }

  initialPlayControls() {
    return (<Icon.Button name="record"
    style={CommonStyles.actionButton}
    onPress={this.play.bind(this)}>
    <Text style={CommonStyles.actionText}>Start</Text>
    </Icon.Button>);
  }

  playingControls() {
    return (
    <View style={styles.miniPlayer}>
      <View style={styles.playerControls}>
        {/* record start / pause */}
        {!this.props.isRecording ?
          <TouchableOpacity onPress={this.startRecording.bind(this)} style={styles.button}>
            <Icon name={'record'} size={60} style={[styles.icon, styles.recordIcon]}/>
          </TouchableOpacity> :
          <TouchableOpacity onPress={this.pauseRecording.bind(this)} style={styles.button}>
            <Icon name={'pause'} size={60} style={[styles.icon, styles.recordIcon]}/>
          </TouchableOpacity>
        }

        {/* record stop */}
        <TouchableOpacity onPress={this.stopRecording.bind(this)} style={styles.button}>
          <Icon name={'stop'} size={60} style={[styles.icon, styles.stopIcon]}/>
        </TouchableOpacity>

        {/* mic On / mic Off */}
        {this.props.isPlaying ?
          <TouchableOpacity onPress={this.toggleMute.bind(this)} style={styles.button}>
            {this.props.isMute ?
              <Icon name={'ios-mic'} size={30} style={styles.icon}/> :
              <Icon name={'ios-mic-off'} size={30} style={styles.icon}/>
            }
          </TouchableOpacity> : null
        }
      </View>
      <ProgressBar fillStyle={styles.progressBarFill}
        backgroundStyle={styles.progressBarBackground}
        style={styles.progressBar}
        progress={this.props.currentTime * 1.0 / this.props.currentDuration} />
    </View>);
  }


  play() {
    this.props.playSong();
  }

  stop() {
    this.props.stopSong();
  }

  startRecording() {
    this.props.startRecording();
  }
  pauseRecording() {
    this.props.pauseRecording();
  }
  stopRecording() {
    this.props.stopRecording();
  }

  toggleMute() {
    this.props.toggleMute();
  }

  _getSoundTimer() {
    return moment.utc(this.props.currentTime).format("mm:ss") + '/' +
      moment.utc(this.props.currentDuration).format("mm:ss");
  }
}

function mapStateToProps(state) {
  return {
    isPlaying: state.songplayer.isPlaying,
    isRecording: state.songplayer.isRecording,
    isActive: state.songplayer.isActive,
    isMute: state.songplayer.isMute,

    currentTime: state.songplayer.currentTime,
    currentDuration: state.songplayer.currentDuration,
    song: state.songplayer.currentSong,
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, SongPlayerActions, RecordingsActions), dispatch);
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(SongPlayer)

const window = Dimensions.get('window');
const styles = StyleSheet.create({
  header: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
    flex: 1,
  },

  songDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  songLeftDetails: {
    flex: 2,
    flexDirection: 'column',
  },
  trackTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: CommonConstants.primaryColor,
    textShadowColor: 'black',
    textShadowRadius: 2,
    textShadowOffset: {height: 1, width: 0}
  },
  timers: {
    fontSize: 14,
    fontWeight: 'bold',
    color: CommonConstants.primaryColor,
    textShadowColor: 'black',
    textShadowRadius: 2,
    textShadowOffset: {height: 1, width: 0}
  },

  songRightDetails: {
    flex: 1,
    flexDirection: 'column',
  },
  trackAlbum: {
    fontSize: 14,
    color: CommonConstants.primaryColor,
    textShadowColor: 'black',
    textShadowRadius: 2,
    textShadowOffset: {height: 1, width: 0}
  },


  miniPlayer: {
    flex: 1,
    flexDirection: 'column',
  },

  playerControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  button: {
    margin: 8,
  },

  icon: {
    color: 'black',
  },

  recordIcon: {
    color: 'red'
  },
  stopIcon: {
    color: 'black'
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
});
