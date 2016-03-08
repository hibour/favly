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

  _renderToggleButton(icons, style, onPress, isOn, size) {
     return (<TouchableOpacity onPress={onPress} style={styles.button}>
        <Icon name={icons.off} size={size} style={[styles.icon, styles[style.off], isOn && styles.hide]}/>
        <Icon name={icons.on} size={size} style={[styles.icon, styles[style.on], !isOn && styles.hide]}/>
      </TouchableOpacity>);
   }

  _renderPlayerControls(recording) {
    return (<View style={styles.header}>
              <View style={styles.recordingDetails}>
                <Text style={styles.trackTitle}>{recording.title}</Text>
                <Text style={styles.trackAlbum}>{moment(recording.time).toNow(true)}</Text>
              </View>
              <View style={styles.playerControls}>
                {this._renderToggleButton({off: 'play', on: 'pause'},
                  {off: 'icon', on: 'icon'},
                  this.playPause.bind(this), this.props.isPlaying, 40)}
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

  playPause() {
    if (this.props.isPlaying) {
      this.props.pauseRecording();
    } else {
      this.props.playRecording();
    }
  }
}

function mapStateToProps(state) {
  return {
    isPlaying: state.recordingplayer.isPlaying,
    currentTime: state.recordingplayer.currentTime,
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
    justifyContent: 'center',
    flexDirection: 'row',
  },

  recordingDetails: {
    height: 30,
    marginLeft: 4,
    flexDirection: 'column',
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
    flexDirection: 'column',
    justifyContent: 'flex-end',
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
  hide: {
    width: 0,
    height: 0
  }
});
