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
          onEndEditing={this.onSearchChange.bind(this)}/>
      )
    }

  onSearchChange(event: Object) {
      var searchTerm = event.nativeEvent.text.toLowerCase();
      console.log(">>> Search term ", searchTerm);
      if (this.props.onSearch) {
        this.props.onSearch(searchTerm);
      }
    }

  renderSong(song) {
    return (<SongItem song={song} onPress={() => {
      if (this.props.onSongSelected) {
        this.props.onSongSelected(song);
      }
    }}/>);
  }
}

module.exports = SongList

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
    borderColor: 'gray',
    color: 'black',
    backgroundColor: 'white',
    borderWidth: 0.5,
   },
});
