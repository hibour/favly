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

import {styles as CommonStyles, constants as CommonConstants} from '../css/common.js'
import PlayerStyles from '../css/player.js'
import Icon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

class SongPlayer extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var song = this.props.song;
    return (<View style={PlayerStyles.header}>
              <View style={PlayerStyles.songDetails}>
                <View style={PlayerStyles.songLeftDetails}>
                  <Text style={PlayerStyles.trackTitle}>{song.title}</Text>
                  <Text style={PlayerStyles.timers}>{this._getSoundTimer()}</Text>
                </View>
                <View style={PlayerStyles.songRightDetails}>
                  <Text style={PlayerStyles.trackAlbum}>{song.album}</Text>
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
    <View style={PlayerStyles.miniPlayer}>
      <View style={PlayerStyles.playerControls}>
        {/* record start / pause */}
        {!this.props.isRecording ?
          <TouchableOpacity onPress={this.startRecording.bind(this)} style={PlayerStyles.button}>
            <Icon name={'record'} size={40} style={[styles.recordIcon]}/>
          </TouchableOpacity> :
          <TouchableOpacity onPress={this.pauseRecording.bind(this)} style={PlayerStyles.button}>
            <Icon name={'pause'} size={40} style={[styles.recordIcon]}/>
          </TouchableOpacity>
        }

        {/* record stop */}
        <TouchableOpacity onPress={this.stopRecording.bind(this)} style={PlayerStyles.button}>
          <Icon name={'stop'} size={60} style={[styles.stopIcon]}/>
        </TouchableOpacity>

        {/* mic On / mic Off */}
        {this.props.isPlaying ?
          <TouchableOpacity onPress={this.toggleMute.bind(this)} style={PlayerStyles.button}>
            {this.props.isMute ?
              <Icon name={'ios-mic'} size={30} style={styles.micIcon}/> :
              <Icon name={'ios-mic-off'} size={30} style={styles.micIcon}/>
            }
          </TouchableOpacity> : null
        }
      </View>
      <ProgressBar fillStyle={PlayerStyles.progressBarFill}
        backgroundStyle={PlayerStyles.progressBarBackground}
        style={PlayerStyles.progressBar}
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

  recordIcon: {
    color: CommonConstants.secondaryColor,
  },
  stopIcon: {
    color: CommonConstants.primaryColor,
  },
  micIcon: {
    color: 'black',
  }
});
