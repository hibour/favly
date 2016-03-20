'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Component,
  ListView,
} = React;

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import {styles as CommonStyles} from '../css/common.js';

import RecordingPlayerActions from '../actions/recordingplayer'
import RecordingItem from './RecordingItem';

class RecordingList extends Component {
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
  }

  render() {
    if (this.props.recordings.length > 0) {
      this.dataSource = this.dataSource.cloneWithRows(this.props.recordings);
      return (
        <ListView dataSource={this.dataSource}
          renderRow={this.renderRecording.bind(this)}
          style={[CommonStyles.listView, styles.listView]}
        />
      );
    } else {
      return this.renderEmptyList();
    }
  }

  renderSearchBar() {
      return (
        <View style={styles.searchCell}>
          <TextInput onChange={this.onSearchChange} placeholder={'Search a Track'} style={styles.searchContainer}/>
        </View>
      )
    }

  renderRecording(recording) {
    return (<RecordingItem recording={recording} onPress={() => {
      this.props.changeRecording(recording);
      Actions.recordingdetails();
    }}/>);
  }

  renderEmptyList() {
    return (
      <View>
        <Text>No recordings Yet!</Text>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(RecordingPlayerActions, dispatch)
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(RecordingList)

const styles = StyleSheet.create({
  listView: {
  },

  searchCell: {
    flex: 1,
    flexDirection: 'row'
  },

  searchContainer: {
    height: 40,
    width: 100,
    flex: 1,
    margin: 4,
    padding: 4,
    borderColor: 'gray',
    color: 'black',
    borderWidth: 1
   },
});
