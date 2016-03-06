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

const Icon = require('react-native-vector-icons/Ionicons');
const CommonStyle = require('../css/common.js')

var Cache = require('../utils/Cache');
var RNFS = require('react-native-fs');
var Sound = require('react-native-sound');
import TimerMixin from 'react-timer-mixin';


import ParallaxScrollView from 'react-native-parallax-scroll-view';
import SongPlayer from '../components/SongPlayer';
import Lyrics from '../components/Lyrics';

var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get('window');

class SongDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      songLoaded: false,
      lyricLoaded: false,
      isRecording: false,
      isMute: false,

      currentTime: 0
    };

    var song = this.props.song;
    // create a path you want to write to
    var songDir = RNFS.CachesDirectoryPath + '/' + song._key;
    this.songPath = songDir + '_v' + song.version + '___song.mp3';
    this.lyricPath = songDir + '_v' + song.version + '___lyric.txt';
    this.lyricData = null;
    this.songSound = null;

    // Loading
    this.preloadingStarted = false;
    this.unMounted = false;
  }

  componentDidMount() {
    this.unMounted = false;
    InteractionManager.runAfterInteractions(() => {
      this.preloadMedia();
    });
    TimerMixin.setInterval(this.syncLyrics.bind(this), 1000);
  }

  componentWillUnmount() {
    if (this.songSound) {
      this.songSound.stop();
      this.songSound = null;
    }
    this.unMounted = true;
    TimerMixin.componentWillUnmount.call(this);
  }

  updateState(state) {
    if (this.unMounted) {
      return;
    }
    this.setState(React.addons.update(this.state, state));
  }

  preloadMedia() {
    if (this.preloadingStarted) {
      return;
    }
    this.preloadingStarted = true;

    var song = this.props.song;
    Cache.getMedia(this.songPath, song.track, function(data) {
      this.songSound = new Sound(this.songPath, '', function(error) {
        if (error) {
           console.log('failed to load the sound', error);
         } else { // loaded successfully
           console.log(">> Sound loaded fine");
           this.updateState({songLoaded: {$set: true}});
         }
      }.bind(this));
    }.bind(this));

    Cache.getText(this.lyricPath, song.lyrics, function(data) {
      this.lyricData = data;
      console.log(">> Lyrics loaded fine");
      this.updateState({lyricLoaded: {$set: true}});
    }.bind(this));
  }

  render() {
    var song = this.props.song;
    return (<ParallaxScrollView
      style={styles.parallax}
      backgroundColor="#FFFFFF"
      contentBackgroundColor="#FFFFFF"
      parallaxHeaderHeight={300}
      stickyHeaderHeight={100}
      renderStickyHeader={() => (
        <View></View>
      )}
      renderForeground={() => (
        <View style={styles.foreground}>
          <Image style={styles.largeArtwork} source={{uri: song.thumbnail}}></Image>
          <SongPlayer song={song} songSound={this.songSound}></SongPlayer>
        </View>
      )}>
      <View style={styles.lyricScreen}>
        <Lyrics lyrics={this.lyricData} isRecording={this.state.isRecording} currentTime={this.state.currentTime} />
      </View>
    </ParallaxScrollView>);
  }

  syncLyrics() {
    console.log(">>> Trying to sync Current Time");
    if (!this.songSound) {
      return;
    }
    console.log(">>> Syncing Current Time");
    this.songSound.getCurrentTime((val) => this.updateState({currentTime: {$set: val * 1000}}) );
  }
}
module.exports = SongDetails;

const styles = StyleSheet.create({

  parallax: {
    marginTop: 50
  },

  largeArtwork: {
    width: deviceWidth,
    height: 200
  }
});
