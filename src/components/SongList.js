'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Component,
  ListView,
  TextInput,
  Dimensions,
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
    return (<View style={[CommonStyles.container, styles.searchContainer]}>
      {this.renderSearchBar()}
      <ListView
        dataSource={this.dataSource}
        renderRow={this.renderSong.bind(this)}
        style={[CommonStyles.listView, styles.listView]}/>
    </View>);
  }

  renderSearchBar() {
      return (
        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Search A Song"
          style={styles.searchEditText}
          onEndEditing={this.onSearchChange}/>
      )
    }

  onSearchChange(event: Object) {
      var searchTerm = event.nativeEvent.text.toLowerCase();
      this.props.searchSongs(searchTerm);
      console.log(">>> Search term ", searchTerm);
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

const window = Dimensions.get('window')
const styles = StyleSheet.create({
  listView: {
  },

  searchContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchEditText: {
    margin: 5,
    padding: 5,
    fontSize: 15,
    height: 30,
    width: window.width - 10,
    flex: 1,
    borderColor: 'gray',
    color: 'black',
    backgroundColor: 'white',
    borderWidth: 0.5,
   },
});
