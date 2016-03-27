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

const RecordingPlayerActions = require('../actions/recordingplayer')
import TimerMixin from 'react-timer-mixin';

const Icon = require('react-native-vector-icons/Ionicons');
const CommonStyle = require('../css/common.js')
const moment = require('moment');

class RecordingPlayer extends Component {

  constructor(props) {
    super(props);
  }

  _renderPlayerControls(recording) {
    return (<View style={styles.header}>
              <View style={styles.songDetails}>
                <View style={styles.songLeftDetails}>
                  <Text style={styles.trackTitle}>{recording.title}</Text>
                  <Text style={styles.timers}>{this._getSoundTimer()}</Text>
                </View>
                <View style={styles.songRightDetails}>
                  <Text style={styles.recordedTime}>{moment(recording.time).toNow(true)}</Text>
                  <Text style={styles.trackAlbum}>{recording.album}</Text>
                </View>
              </View>

              <View style={styles.playerControls}>
                {/* play / pause */}
                {!this.props.isPlaying ?
                  <TouchableOpacity onPress={this.play.bind(this)} style={styles.button}>
                    <Icon name={'play'} size={60} style={[styles.icon, styles.playIcon]}/>
                  </TouchableOpacity> :
                  <TouchableOpacity onPress={this.pause.bind(this)} style={styles.button}>
                    <Icon name={'pause'} size={60} style={[styles.icon, styles.pauseIcon]}/>
                  </TouchableOpacity>
                }
              </View>
            </View>);
  }

  _renderEmpty() {
    return (<View style={styles.header}>
              <View style={styles.recordingDetails}>
                <Text style={styles.trackTitle}>{'Select a Recording to Play'}</Text>
              </View>
            </View>);
  }

  render() {
    if (this.props.recording) {
      return (this._renderPlayerControls(this.props.recording));
    } else {
      return (this._renderEmpty());
    }
  }

  play() {
    this.props.startRecordingPlayback();
  }
  pause() {
    this.props.pauseRecordingPlayback();
  }

  _getSoundTimer() {
    return moment.utc(this.props.currentTime).format("mm:ss") + '/' +
      moment.utc(this.props.currentDuration).format("mm:ss");
  }
}

function mapStateToProps(state) {
  return {
    isPlaying: state.recordingplayer.isPlaying,
    currentTime: state.recordingplayer.currentTime,
    currentDuration: state.recordingplayer.currentDuration,
    recording: state.recordingplayer.currentRecording,
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(RecordingPlayerActions, dispatch);
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(RecordingPlayer)

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
  },

  songDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  songLeftDetails: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  songRightDetails: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  timers: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  recordedTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  trackAlbum: {
    fontSize: 12,
    color: 'black',
  },


  playerControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  button: {
    margin: 4,
  },

  icon: {
    color: 'black',
  },
});
