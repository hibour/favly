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
  BackAndroid,
} = React;

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import Icon from 'react-native-vector-icons/Ionicons';

import LinearGradient from 'react-native-linear-gradient';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import SongPlayer from '../components/SongPlayer';
import Lyrics from '../components/Lyrics';
import SongsActions from '../actions/songs'
import SongPlayerActions from '../actions/songplayer'

class SongDetails extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => Actions.pop());
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.downloadSong(this.props.song);
    });
  }

  componentWillUnmount() {
    this.props.stopSong();
  }

  render() {
    var song = this.props.song;
    var body = this.renderDownloadState(song);

    return (<ParallaxScrollView
          ref="ParallaxView"
          headerBackgroundColor="#FFFFFF"
          contentBackgroundColor="#FFFFFF"
          backgroundColor="#FFFFFF"
          stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
          parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
          backgroundSpeed={10}

          renderBackground={() => (
            <View key="background">
              <Image style={styles.largeArtwork} source={{uri: song.thumbnail}}></Image>
            </View>
          )}

          renderForeground={() => (
            <View key="parallax-header" style={ styles.parallaxHeader }>
              <LinearGradient key="background" colors={['#00000000', '#000000ff']} style={styles.linearGradient}>
                <SongPlayer/>
              </LinearGradient>
            </View>
          )}

          renderStickyHeader={() => (
            <View key="sticky-header" style={ styles.stickySection }>
              <SongPlayer/>
            </View>
          )}

          renderFixedHeader={() => (
            <View key="fixed-header" style={styles.fixedSection}>
              <Text style={styles.fixedSectionText}
                    onPress={() => this.refs.ParallaxView.scrollTo({ x: 0, y: 0 })}>
                Top
              </Text>
            </View>
          )}>
          {body}
    </ParallaxScrollView>);
  }

  renderDownloadState(song) {
    return (
      <View style={styles.container}>
        {song.isLoaded ? this.renderLyricView(song) : this.renderDownloadingView(song)}
      </View>
    );
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
    <View style={styles.container}>
      <Lyrics lyrics={song.lyricData} />
    </View>);
  }
}

function mapStateToProps(state) {
  return {
    song: state.songplayer.currentSong,
    songRecordings: state.recordings.songToRecordingMapping
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, SongPlayerActions, SongsActions), dispatch);
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(SongDetails)

const window = Dimensions.get('window');
const PARALLAX_HEADER_HEIGHT = 250;
const STICKY_HEADER_HEIGHT = 110;
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },

  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },

  stickySection: {
    height: STICKY_HEADER_HEIGHT,
    width: window.width,
  },

  parallaxHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingTop: 150,
    width: window.width,
  },

  largeArtwork: {
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT,
  },
  linearGradient: {
    flex: 1,
  },

  // TOP label
  fixedSection: {
    position: 'absolute',
    bottom: 30,
    right: 10
  },
  fixedSectionText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
