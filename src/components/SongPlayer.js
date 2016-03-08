'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Component,
  InteractionManager,
} = React;

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const SongPlayerActions = require('../actions/songplayer')
const RecordingsActions = require('../actions/recordings')
import TimerMixin from 'react-timer-mixin';

const Icon = require('react-native-vector-icons/Ionicons');
const CommonStyle = require('../css/common.js')
const moment = require('moment');

var {AudioRecorder} = require('react-native-audio');

class SongPlayer extends Component {

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    TimerMixin.componentWillUnmount.call(this);
  }

  initAudioRecorder() {
    TimerMixin.setInterval(this.syncCurrentTime.bind(this), 1000);
  }

  _renderToggleButton(icons, style, onPress, isOn, size) {
     return (<TouchableOpacity onPress={onPress} style={styles.button}>
        <Icon name={icons.off} size={size} style={[styles.icon, styles[style.off], isOn && styles.hide]}/>
        <Icon name={icons.on} size={size} style={[styles.icon, styles[style.on], !isOn && styles.hide]}/>
      </TouchableOpacity>);
   }
   _renderButton(icon, style, onPress, isOn, size) {
      return (<TouchableOpacity onPress={onPress} style={styles.button}>
         <Icon name={icon} size={size} style={[styles.icon, styles[style], isOn && styles.hide]}/>
       </TouchableOpacity>);
    }

  _renderPlayerControls(song) {
    return (<View style={styles.header}>
              <View style={styles.songDetails}>
                <Text style={styles.trackTitle}>{song.title}</Text>
                <Text style={styles.trackAlbum}>{song.album}</Text>
              </View>
              <View style={styles.playerControls}>
                <Text style={styles.timers}>{this._getSoundTimer()}</Text>
                {this._renderToggleButton({off: 'record', on: 'pause'},
                  {off: 'recordIcon', on: 'pauseIcon'},
                  this.playPause.bind(this), this.props.isPlaying, 60)}

                {this._renderButton('stop', 'icon',
                  this.stop.bind(this), !this.props.isRecording, 50)}

                {this._renderToggleButton({off: 'ios-mic', on: 'ios-mic-off'},
                  {off: 'icon', on: 'icon'},
                  this.toggleMute.bind(this), this.props.isMute, 30)}
              </View>
            </View>);
  }

  render() {
    return (this._renderPlayerControls(this.props.song));
  }

  playPause() {
    if (this.props.isPlaying) {
      this.props.pauseSong();
    } else {
      this.props.playSong();
      // Recording is not started. lets start it.
      if (!this.props.isRecording) {
        this.initAudioRecorder();
        this.props.startRecording();
      }
    }
  }

  toggleMute() {
    this.props.toggleMute();
  }

  stop() {
    this.props.stopRecording();
  }

  _getSoundTimer() {
    if (!this.props.songSound) {
      return;
    }
    return moment.utc(this.props.currentTime).format("mm:ss") + '/' +
      moment.utc(this.props.songSound.getDuration() * 1000).format("mm:ss");
  }

  syncCurrentTime() {
    if (!this.props.songSound) {
      return;
    }
    this.props.songSound.getCurrentTime((val) => this.props.setCurrentTime(val * 1000));
  }
}

function mapStateToProps(state) {
  return {
    isPlaying: state.songplayer.isPlaying,
    isRecording: state.songplayer.isRecording,
    isMute: state.songplayer.isMute,

    currentTime: state.songplayer.currentTime,
    song: state.songplayer.currentSong,
    songSound: state.songplayer.songSound,
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, SongPlayerActions, RecordingsActions), dispatch);
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(SongPlayer)

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },

  foreground: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },

  songDetails: {
    flex: 1,
    height: 30,
    marginLeft: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  trackTitle: {
    fontSize: 20,
    textAlign: 'left'
  },

  trackAlbum: {
    fontSize: 12,
    textAlign: 'left',
    marginLeft: 4
  },

  playerControls: {
    height: 30,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10
  },
  icon: {
    margin: 4,
    padding: 4,
    color: 'black',
  },

  recordIcon: {
    color: 'red'
  },
  pauseIcon: {
    color: 'blue'
  },

  timers: {
    fontSize: 12,
    textAlign: 'left',
    marginLeft: 4
  },

  hide: {
    width: 0,
    height: 0
  }
});
