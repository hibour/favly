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

import ProgressBar from './ProgressBar'
import RecordingPlayerActions from '../actions/recordingplayer'
import Icon from 'react-native-vector-icons/Ionicons'
import {styles as CommonStyles, constants as CommonConstants} from '../css/common.js'
import PlayerStyles from '../css/player.js'
import moment from 'moment';

class RecordingPlayer extends Component {

  constructor(props) {
    super(props);
  }

  _renderPlayerControls(recording) {
    return (<View style={PlayerStyles.header}>
              <View style={PlayerStyles.songDetails}>
                <View style={PlayerStyles.songLeftDetails}>
                  <Text style={PlayerStyles.trackTitle}>{recording.title}</Text>
                  <Text style={PlayerStyles.timers}>{this._getSoundTimer()}</Text>
                </View>
                <View style={PlayerStyles.songRightDetails}>
                  <Text style={PlayerStyles.recordedTime}>{moment(recording.time).toNow(true)}</Text>
                  <Text style={PlayerStyles.trackAlbum}>{recording.album}</Text>
                </View>
              </View>
              {this.props.isActive ? this.playingControls() : this.initialPlayControls()}
            </View>);
  }

  _renderEmpty() {
    return (<View style={PlayerStyles.header}>
              <View style={PlayerStyles.recordingDetails}>
                <Text style={PlayerStyles.trackTitle}>{'Select a Recording to Play'}</Text>
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

  initialPlayControls() {
    return (<Icon.Button name="play"
    style={CommonStyles.actionButton}
    onPress={this.play.bind(this)}>
    <Text style={CommonStyles.actionText}>Play</Text>
    </Icon.Button>);
  }

  playingControls() {
    return (
    <View style={PlayerStyles.miniPlayer}>
      <View style={PlayerStyles.playerControls}>
        {/* record start / pause */}
        {!this.props.isPlaying ?
          <TouchableOpacity onPress={this.play.bind(this)} style={PlayerStyles.button}>
            <Icon name={'play'} size={60} style={[styles.playIcon]}/>
          </TouchableOpacity> :
          <TouchableOpacity onPress={this.pause.bind(this)} style={PlayerStyles.button}>
            <Icon name={'pause'} size={60} style={[styles.playIcon]}/>
          </TouchableOpacity>
        }
      </View>
      <ProgressBar fillStyle={PlayerStyles.progressBarFill}
        backgroundStyle={PlayerStyles.progressBarBackground}
        style={PlayerStyles.progressBar}
        progress={this.props.currentTime * 1.0 / this.props.currentDuration} />
    </View>);
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
    isActive: state.recordingplayer.isActive,
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
  playIcon: {
    color: CommonConstants.primaryColor,
  },
});
