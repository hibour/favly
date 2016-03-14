'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Component,
  InteractionManager,
  ListView,
} = React;

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const SongPlayerActions = require('../actions/songplayer')

const CommonStyle = require('../css/common.js')
var LRC = require('../utils/lrc')

class Lyrics extends Component {

  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
  }

  outputHandler(line, extra) {
    if(!line){ return }
    console.log(line);
  }

  createLRCPlayerIfNeeded(lyricData) {
    if (this.lrcPlayer || !lyricData) {
      return;
    }
    this.lrcPlayer = new LRC.Lrc(lyricData, this.outputHandler);
    this.dataSource = this.dataSource.cloneWithRows(this.lrcPlayer.txts);
  }

  render() {
    if (this.props.song.isLoaded) {
      this.createLRCPlayerIfNeeded(this.props.song.lyricsData);
      var highlightLine = Math.max(this.lrcPlayer.findLineAt(this.props.currentTime) - 1, 0);
      var scrollTo = {x: 0, y: highlightLine * 46, animated: true};
      return (
        <ListView ref={(scrollView) => {
            if (scrollView) {
              scrollView.scrollTo(scrollTo);
            }
          }
        }
          dataSource={this.dataSource}
          renderRow={(rowData) => <Text style={styles.lyricLine}>{rowData}</Text>}
        />
      );
    }
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
    textAlign: 'center',
    height: 46
  },
});
