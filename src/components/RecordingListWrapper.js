'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Component,
  Dimensions,
} = React;

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import {styles as CommonStyles} from '../css/common.js'

import RecordingPlayerActions from '../actions/recordingplayer'
import RecordingsActions from '../actions/recordings'
import RecordingPlayer from './RecordingPlayer';
import RecordingList from './RecordingList';

class RecordingListWrapper extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(">>>>> RecordingListWrapper mounted. Loading offline");
    this.props.loadOfflineRecordings();
  }

  render() {
    if (!this.props.recordingList) {
      return this.renderLoadingView();
    }
    return this.renderRecordings();
  }

  renderLoadingView() {
    return (
      <View style={[CommonStyles.container, tyles.container]}>
        <Text>No Recordings Yet!</Text>
      </View>
    );
  }

  renderRecordings() {
    return (<View style={[CommonStyles.container, styles.container]}>
        <RecordingList recordings={this.props.recordingList}
          onRecordingSelected={this.onRecordingSelected.bind(this)}
        />
      </View>);
  }

  onRecordingSelected(recording) {
    this.props.changeRecording(recording);
    Actions.recordingdetails();
  }
}

function mapStateToProps(state) {
  return {
    recordingList: state.recordings.recordingList
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, RecordingsActions, RecordingPlayerActions), dispatch)
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(RecordingListWrapper)

const window = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
