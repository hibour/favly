'use strict';
var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Image,
  Component,
  TouchableOpacity,
  InteractionManager,
  Dimensions,
  BackAndroid,
} = React;

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import {styles as CommonStyles, constants as CommonConstants} from '../css/common.js';
import RecordingPlayer from '../components/RecordingPlayer';
import RecordingsActions from '../actions/recordings'
import RecordingPlayerActions from '../actions/recordingplayer'
import Icon from 'react-native-vector-icons/Ionicons';

import Constants from '../utils/constants'

class RecordingDetails extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => Actions.pop());
  }

  componentWillUnmount() {
    this.props.stopRecordingPlayback();
  }

  render() {
    var recording = this.props.recording;
    if (!recording) {
      InteractionManager.runAfterInteractions(() => {
        Actions.pop();
      });
      return (<View></View>);
    }
    return (<View style={styles.container} key="background">
              <Image source={{uri: Constants.getCDNUrl(recording.thumbnail)}} style={styles.largeArtwork}/>
              <RecordingPlayer/>
              <View style={styles.recordingFileControls}>
                <Icon.Button name="share"
                  style={CommonStyles.actionButton2}
                  onPress={this.share.bind(this)}>
                  <Text style={CommonStyles.actionText}>Share</Text>
                </Icon.Button>
                <TouchableOpacity onPress={this.delete.bind(this)} style={styles.button}>
                  <Icon name={'trash-b'} size={40} style={[styles.icon, styles.deleteIcon]}/>
                </TouchableOpacity>
              </View>
            </View>)
  }

  share() {
    this.props.shareRecording(this.props.recording);
  }

  delete() {
    this.props.deleteRecording(this.props.recording.id);
  }
}

function mapStateToProps(state) {
  return {
    recording: state.recordingplayer.currentRecording
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, RecordingPlayerActions, RecordingsActions), dispatch);
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(RecordingDetails)

const window = Dimensions.get('window');
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },

  largeArtwork: {
    width: window.width,
    height: 300,
  },

  recordingFileControls: {
    alignItems: 'center',
    flexDirection: 'column',
  },
});
