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
import {Actions} from 'react-native-router-flux'

import {styles as CommonStyles} from '../css/common.js'

import SongList from './SongList';
import SongsActions from '../actions/songs'
import SongPlayerActions from '../actions/songplayer'

class SongListWrapper extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.loadOfflineSongs();
    this.props.loadOnlineSongs();
  }

  render() {
    if (!this.props.songList || this.props.songList.length == 0) {
      return this.renderLoadingView();
    }
    return this.renderSongs();
  }

  renderLoadingView() {
    return (
      <View style={[CommonStyles.container, styles.container]}>
        <Text>Loading songs...</Text>
      </View>
    );
  }

  renderSongs() {
    return (
      <View style={[CommonStyles.container, styles.container]}>
        <SongList songs={this.props.songList}
          onSongSelected={this.onSongSelected.bind(this)}
          onSearch={this.onSearch.bind(this)}
        />
      </View>
    );
  }

  onSearch(searchTerm) {
    this.props.searchSongs(searchTerm)
  }

  onSongSelected(song) {
    this.props.changeSong(song);
    Actions.songdetails();
  }
}

function mapStateToProps(state) {
  return {
    songList: state.songs.songList
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, SongsActions, SongPlayerActions), dispatch)
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(SongListWrapper)

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
