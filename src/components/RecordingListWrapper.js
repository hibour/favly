'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Component,
} = React;

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const RecordingList = require('./RecordingList');
const RecordingsActions = require('../actions/recordings')

class RecordingListWrapper extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadOfflineRecordings();
  }

  render() {
    if (!this.props.recordings) {
      return this.renderLoadingView();
    }
    return this.renderRecordings();
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>No Recordings Yet!</Text>
      </View>
    );
  }

  renderRecordings() {
    return (<RecordingList recordings={this.props.recordings}/>);
  }
}

function mapStateToProps(state) {
  return {
    recordings: state.recordings.recordings
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(RecordingsActions, dispatch)
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(RecordingListWrapper)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
