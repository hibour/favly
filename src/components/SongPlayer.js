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

  getAudioRecordingPath() {
    return '/' + this.props.song._key + '.caf';
  }

  initAudioRecorder() {
    AudioRecorder.prepareRecordingAtPath(this.getAudioRecordingPath());
    // AudioRecorder.onProgress = (data) => {
    //   this.setState({currentTime: Math.floor(data.currentTime)});
    // };
    AudioRecorder.onFinished = (data) => {
      console.log(`>>>>> Finished recording: ${data.finished}`)
    };
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

  _renderPlayerControls(song, songSound) {
    return (<View style={styles.header}>
              <View style={styles.songDetails}>
                <Text style={styles.trackTitle}>{song.title}</Text>
                <Text style={styles.trackAlbum}>{song.album}</Text>
              </View>
              <View style={styles.playerControls}>
                <Text style={styles.timers}>{this._getSoundTimer(songSound)}</Text>
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
    return (this._renderPlayerControls(this.props.song, this.props.songSound));
  }

  playPause() {
    var songSound = this.props.songSound;
    if (!songSound) {
      return;
    }

    if (this.props.isPlaying) {
      songSound.pause();
      AudioRecorder.pauseRecording();
    } else {
      // Recording is not started. lets start it.
      if (!this.props.isRecording) {
        this.initAudioRecorder();
        AudioRecorder.startRecording();
      }
      songSound.play();
    }
    this.props.startOrPauseRecording();
  }

  toggleMute() {
    this.props.toggleMute();
  }

  stop() {
    AudioRecorder.stopRecording();
    //AudioRecorder.playRecording();
    this.props.songSound.stop();
    this.props.stopRecording();
    this.props.addRecording({
      path: this.getAudioRecordingPath(),
      title: this.props.song.title,
      songid: this.props.song._key,
      time: moment().toISOString()});
  }

  _getSoundTimer(songSound) {
    if (!songSound) {
      return '--/--';
    }
    return moment.utc(this.props.currentTime).format("mm:ss") + '/' +
      moment.utc(songSound.getDuration() * 1000).format("mm:ss");
  }

  syncCurrentTime() {
    if (!this.props.isRecording) {
      return;
    }
    console.log(">>> Sync current time2");
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
