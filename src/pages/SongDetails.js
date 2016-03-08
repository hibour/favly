'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Component,
  InteractionManager,
  Dimensions,
} = React;
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const Icon = require('react-native-vector-icons/Ionicons');
const CommonStyle = require('../css/common.js')


import ParallaxScrollView from 'react-native-parallax-scroll-view';
import SongPlayer from '../components/SongPlayer';
import Lyrics from '../components/Lyrics';
import SongsActions from '../actions/songs'
import SongPlayerActions from '../actions/songplayer'

var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get('window');

class SongDetails extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.downloadSong(this.props.song);
    });
  }

  componentWillUnmount() {
    this.props.stopRecording();
  }

  render() {
    var song = this.props.song;
    var body = this.renderDownloadState(song);

    return (<ParallaxScrollView
      style={styles.parallax}
      backgroundColor="#FFFFFF"
      contentBackgroundColor="#FFFFFF"
      parallaxHeaderHeight={300}
      stickyHeaderHeight={100}
      renderStickyHeader={() => (
        <SongPlayer></SongPlayer>
      )}
      renderForeground={() => (
        <View style={styles.foreground}>
          <Image style={styles.largeArtwork} source={{uri: song.thumbnail}}></Image>
          <SongPlayer></SongPlayer>
        </View>
      )}>

      {body}

    </ParallaxScrollView>);
  }

  renderDownloadState(song) {
    if (song.isDownloading) {
      return this.renderDownloadingView(song);
    } else if (song.isLoaded) {
      return this.renderLyricView(song);
    }
  }

  renderDownloadingView(song) {
    return (
      <View style={styles.container}>
        <Text>{song.downloadProgress}% Loaded</Text>
      </View>
    );
  }

  renderLyricView(song) {
    return (
    <View style={styles.lyricScreen}>
      <Lyrics lyrics={song.lyricData} />
    </View>);
  }
}

function mapStateToProps(state) {
  return {
    song: state.songplayer.currentSong,
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, SongPlayerActions, SongsActions), dispatch);
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(SongDetails)

const styles = StyleSheet.create({

  parallax: {
    marginTop: 50
  },

  largeArtwork: {
    width: deviceWidth,
    height: 200
  }
});
