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
import {styles as CommonStyles} from '../css/common.js'

import SongList from './SongList';
import SongsActions from '../actions/songs'

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
        <SongList songs={this.props.songList}/>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    songList: state.songs.songList
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(SongsActions, dispatch)
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(SongListWrapper)

const window = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
