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
const SongList = require('./SongList');
const SongsActions = require('../actions/songs')

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
      <View style={styles.container}>
        <Text>Loading songs...</Text>
      </View>
    );
  }

  renderSongs() {
    return (<SongList songs={this.props.songList}/>);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
