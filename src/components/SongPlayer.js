'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Component,
  InteractionManager,
} = React;

const Icon = require('react-native-vector-icons/Ionicons');
const CommonStyle = require('../css/common.js')
var LRC = require('../utils/lrc')

class SongPlayer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isRecording: false,
      isMute: false,
      currentTime: 0
    };
    this.isPlaying = false;
  }

  updateState(state) {
    this.setState(React.addons.update(this.state, state));
  }

  _renderStickyHeader(song, songSound) {
    return (<View style={styles.header}>
              <View style={styles.songDetails}>
                <Text style={styles.trackTitle}>{song.title}</Text>
                <Text style={styles.trackAlbum}>{song.album}</Text>
              </View>
              <View style={styles.playerControls}>
                <Text style={styles.timers}>{this._getSoundTimer(songSound)}</Text>
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
    var songSound = this.props.songSound;
    if (this.state.isRecording) {
      if (songSound && !this.isPlaying) {
        songSound.play();
        this.isPlaying = true;
      }
    } else {
      this.isPlaying = false;
      if (songSound) {
        songSound.pause();
      }
    }
    return (this._renderStickyHeader(this.props.song, songSound));
  }

  playPause() {
    this.updateState({isRecording: {$set: !this.state.isRecording}});
  }

  toggleMute() {
    this.updateState({isMute: {$set: !this.state.isMute}});
  }

  _getSoundTimer(songSound) {
    if (!songSound) {
      return '--/--';
    }
    return '--/' + songSound.getDuration();
  }
}
module.exports = SongPlayer;

const styles = StyleSheet.create({
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

  hide: {
    width: 0,
    height: 0
  }
});
