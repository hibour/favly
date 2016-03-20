'use strict';
var React = require('react-native');
var {
  StyleSheet,
  View,
  Text,
  Image,
  Component,
  TouchableOpacity,
  Dimensions,
} = React;

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import RecordingPlayer from '../components/RecordingPlayer';
import RecordingsActions from '../actions/recordings'
import RecordingPlayerActions from '../actions/recordingplayer'
const Icon = require('react-native-vector-icons/Ionicons');

class RecordingDetails extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.stopRecording();
  }

  render() {
    var recording = this.props.recording;
    return (<View style={styles.container} key="background">
              <Image style={styles.largeArtwork} source={{uri: recording.thumbnail}}/>
              <RecordingPlayer/>
              <View style={styles.recordingFileControls}>
                <Icon.Button name="share" backgroundColor="#3b5998" onPress={this.share.bind(this)}>
                  <Text style={{fontSize: 14}}>Share</Text>
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
    Actions.home();
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
