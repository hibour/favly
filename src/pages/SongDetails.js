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

  isMediaLoaded() {
    return this.state.songLoaded && this.state.lyricLoaded;
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

  _getSoundTimer() {
    if (!this.songSound) {
      return '--/--';
    }
    return '--/' + this.songSound.getDuration();
  }

  _renderStickyHeader(song, songSound) {
    return (<View style={styles.header}>
              <View style={styles.songDetails}>
                <Text style={styles.trackTitle}>{song.title}</Text>
                <Text style={styles.trackAlbum}>{song.album}</Text>
              </View>
              <View style={styles.playerControls}>
                <Text style={styles.timers}>{this._getSoundTimer()}</Text>
                <TouchableOpacity key={'recond-button'} onPress={this.playPause.bind(this)} style={styles.button}>
                  <Icon name={'record'} size={50} style={[styles.icon, styles.recordIcon, this.state.isRecording && styles.hide]}/>
                  <Icon name={'pause'} size={50} style={[styles.icon, styles.pauseIcon, !this.state.isRecording && styles.hide]}/>
                </TouchableOpacity>
                <TouchableOpacity key={'mute-button'} onPress={this.toggleMute.bind(this)} style={styles.button}>
                  <Icon name={'ios-mic'} size={30} style={[styles.icon, this.state.isMute && styles.hide]}/>
                  <Icon name={'ios-mic-off'} size={30} style={[styles.icon, !this.state.isMute && styles.hide]}/>
                </TouchableOpacity>
              </View>
            </View>);
  }

  render() {
    var showSpinner = false;

    if (this.state.isRecording) {
      if (this.isMediaLoaded()) {
        this.songSound.play();
      } else {
        showSpinner = true;
      }
    } else {
      if (this.songSound) {
        this.songSound.pause();
      }
    }

    var song = this.props.song;
    return (<ParallaxScrollView
      style={styles.parallax}
      backgroundColor="#FFFFFF"
      contentBackgroundColor="#FFFFFF"
      parallaxHeaderHeight={300}
      stickyHeaderHeight={100}
      renderStickyHeader={() => {
        var self = this;
        return () => {self._renderStickyHeader(song)};
      }}
      renderForeground={() => (
        <View style={styles.foreground}>
          <Image style={styles.largeArtwork} source={{uri: song.thumbnail}}></Image>
          {
            this._renderStickyHeader(song)
          }
        </View>
      )}>
      <View style={styles.lyricScreen}>
        <Lyrics lyrics={this.lyricData} isRecording={this.state.isRecording} currentTime={this.state.currentTime} />
      </View>
    </ParallaxScrollView>);
  }

  playPause() {
    this.updateState({isRecording: {$set: !this.state.isRecording}});
  }

  toggleMute() {
    this.updateState({isMute: {$set: !this.state.isMute}});
  }

  syncLyrics() {
    console.log(">>> Trying to sync Current Time");
    if (!this.songSound || !this.state.isRecording) {
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

    header: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },

    foreground: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },

    songDetails: {
      flex: 1,
      height: 30,
      marginLeft: 4,
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: 'white'
    },
    trackTitle: {
      fontSize: 20,
      textAlign: 'left'
    },
    trackAlbum: {
      fontSize: 12,
      textAlign: 'left',
      marginLeft: 4
    },

    playerControls: {
      height: 30,
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white'
    },
    button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 10
    },
    icon: {
      margin: 4,
      padding: 4,
      color: 'black',
    },

    recordIcon: {
      color: 'red'
    },
    pauseIcon: {
      color: 'blue'
    },

    timers: {
      fontSize: 12,
      textAlign: 'left',
      marginLeft: 4
    },

    largeArtwork: {
      width: deviceWidth,
      height: 200
    },

    hide: {
      width: 0,
      height: 0
    }
});
