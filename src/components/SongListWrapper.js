'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Component,
} = React;

import SongList from './SongList';
import Constants from '../utils/constants.js'
const Firebase = require('firebase');

class SongListWrapper extends Component {
  constructor(props) {
    super(props);
    this.songsRef = this.props.database.child("songs");
    this.state = {
      songs: null
    };
  }

  componentDidMount() {
    this.listenForItems(this.songsRef);
  }

  listenForItems(songsRef) {
    songsRef.on('value', (snap) => {
      var songs = [];
      snap.forEach((child) => {
        songs.push({
          title: child.val().title,
          album: child.val().album,
          year: child.val().year,
          thumbnail: child.val().thumbnail,
          track: child.val().track,
          lyrics: child.val().lyrics,
          version: child.val().version,
          _key: child.key()
        });
      });
      this.setState({songs: songs});
    });
  }

  render() {
    if (!this.state.songs) {
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
    return (<SongList songs={this.state.songs}/>);
  }
}

module.exports = SongListWrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
