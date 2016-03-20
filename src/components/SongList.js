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
import {styles as CommonStyles} from '../css/common.js';

import {Actions} from 'react-native-router-flux'
import SongPlayerActions from '../actions/songplayer'

import SongItem from './SongItem';

class SongList extends Component {
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
  }

  render() {
    this.dataSource = this.dataSource.cloneWithRows(this.props.songs);
    return (<ListView
        dataSource={this.dataSource}
        renderRow={this.renderSong.bind(this)}
        style={[CommonStyles.listView, styles.listView]}
      />);
  }

  renderSearchBar() {
      return (
        <View style={styles.searchCell}>
          <TextInput onChange={this.onSearchChange} placeholder={'Search a Track'} style={styles.searchContainer}/>
        </View>
      )
    }

  renderSong(song) {
    return (<SongItem song={song} onPress={() => {
      this.props.changeSong(song);
      Actions.songdetails();
    }}/>);
  }
}

function mapStateToProps(state) {
  return {
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(SongPlayerActions, dispatch)
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(SongList)

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
