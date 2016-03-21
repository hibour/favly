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

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SongPlayerActions from '../actions/songplayer'
import RecordingsActions from '../actions/recordings'

import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

class SongPlayer extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var song = this.props.song;
    return (<View style={styles.header}>
              <View style={styles.songDetails}>
                <View style={styles.songLeftDetails}>
                  <Text style={styles.trackTitle}>{song.title}</Text>
                  <Text style={styles.timers}>{this._getSoundTimer()}</Text>
                </View>
                <View style={styles.songRightDetails}>
                  <Text style={styles.trackAlbum}>{song.album}</Text>
                </View>
              </View>

              <View style={styles.playerControls}>
                {/* record / stop */}
                {!this.props.isPlaying ?
                  <TouchableOpacity onPress={this.play.bind(this)} style={styles.button}>
                    <Icon name={'record'} size={60} style={[styles.icon, styles.recordIcon]}/>
                  </TouchableOpacity> :
                  <TouchableOpacity onPress={this.stop.bind(this)} style={styles.button}>
                    <Icon name={'stop'} size={60} style={[styles.icon, styles.stopIcon]}/>
                  </TouchableOpacity>
                }

                {/* pause */}
                {/*this.props.isPlaying ?
                  <TouchableOpacity onPress={this.pause.bind(this)} style={styles.button}>
                    <Icon name={'pause'} size={40} style={[styles.icon, styles.pauseIcon]}/>
                  </TouchableOpacity> : null
                */}

                {/* mic On / mic Off */}
                {this.props.isPlaying ?
                  <TouchableOpacity onPress={this.toggleMute.bind(this)} style={styles.button}>
                    {this.props.isMute ?
                      <Icon name={'ios-mic'} size={30} style={styles.icon}/> :
                      <Icon name={'ios-mic-off'} size={30} style={styles.icon}/>
                    }
                  </TouchableOpacity> : null
                }
              </View>
            </View>);
  }

  play() {
    this.props.playSong();
  }
  pause() {
    this.props.pauseSong();
  }
  stop() {
    this.props.stopSong();
  }

  toggleMute() {
    this.props.toggleMute();
  }

  _getSoundTimer() {
    return moment.utc(this.props.currentTime).format("mm:ss") + '/' +
      moment.utc(this.props.currentDuration).format("mm:ss");
  }
}

function mapStateToProps(state) {
  return {
    isPlaying: state.songplayer.isPlaying,
    isMute: state.songplayer.isMute,

    currentTime: state.songplayer.currentTime,
    currentDuration: state.songplayer.currentDuration,
    song: state.songplayer.currentSong,
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, SongPlayerActions, RecordingsActions), dispatch);
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(SongPlayer)

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
  },

  songDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  songLeftDetails: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  songRightDetails: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  timers: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'black',
  },
  trackAlbum: {
    fontSize: 12,
    color: 'black',
  },


  playerControls: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  button: {
    margin: 4,
  },

  icon: {
    color: 'black',
  },

  recordIcon: {
    color: 'red'
  },
  pauseIcon: {
    color: 'blue'
  },
  stopIcon: {
    color: 'black'
  },
});
