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
const SongPlayerActions = require('../actions/songplayer')

const CommonStyle = require('../css/common.js')
var LRC = require('../utils/lrc')

class Lyrics extends Component {

  constructor(props) {
    super(props);
    this.state = {
      lyricsParsed: false
    };
  }

  outputHandler(line, extra) {
    if(!line){ return }
    console.log(line);
  }

  createLRCPlayerIfNeeded(lyricData) {
    if (this.lrcPlayer || !lyricData) {
      return;
    }
    InteractionManager.runAfterInteractions(function() {
      this.lrcPlayer = new LRC.Lrc(lyricData, this.outputHandler.bind(this));
      this.setState({
        ...this.state,
        lyricsParsed: true
      });
    }.bind(this));
  }

  render() {
    var txts = ['Loading'];
    var highlightLine = 0;

    if (this.props.song.isLoaded) {
      this.createLRCPlayerIfNeeded(this.props.song.lyricsData);
      if (this.state.lyricsParsed) {
        highlightLine = this.lrcPlayer.findLineAt(this.props.currentTime);
        txts = this.lrcPlayer.txts;
        console.log(">> Lyrics being rendered ", this.props.currentTime, highlightLine);
      }
    }

    return (
        <View style={styles.container}>
          <Text style={styles.lyricLine}>{txts[highlightLine]}</Text>
        </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentTime: state.songplayer.currentTime,
    song: state.songplayer.currentSong,
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(SongPlayerActions, dispatch)
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Lyrics)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },

  lyricLine: {
    fontSize: 20,
    textAlign: 'center'
  },
});
