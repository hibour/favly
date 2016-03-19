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
  Dimensions,
} = React;

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
const SongPlayerActions = require('../actions/songplayer')

const CommonStyle = require('../css/common.js')
import LyricLine from './LyricLine'

var {
  height: deviceHeight,
  width: deviceWidth
} = Dimensions.get('window');

class Lyrics extends Component {

  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this._listView = null;
    this._scrollPosition = null;
  }

  render() {
    if (this.props.song.isLoaded) {
      if (this.props.lrcPlayer) {
        this.dataSource = this.dataSource.cloneWithRows(this.props.lrcPlayer.txts);
      }
      return (
        <ListView ref="listView" style={styles.container} dataSource={this.dataSource}
        renderRow={this._renderRow.bind(this)}/>
      );
    }
  }

  componentDidMount() {
    this._scrollToHelper();
  }

  scrollTo(yposition) {
    this._scrollPosition = {
      x: 0,
      y: yposition,
      animated: true
    }
    this._scrollToHelper();
  }

  _scrollToHelper() {
    if (this.refs.listView && this._scrollPosition) {
      //InteractionManager.runAfterInteractions(() => {
        console.log(">>> Trying to scroll to ", this._scrollPosition.y);
        this.refs.listView.scrollTo(this._scrollPosition);
      //})
    }
  }

  _renderRow(rowData, sectionID, rowID) {
      return (<LyricLine style={styles.lyricLine}
        text={rowData}
        rowID={rowID}
        scrollDelegate={this}
        />);
  }
}

function mapStateToProps(state) {
  return {
    song: state.songplayer.currentSong,
    lrcPlayer: state.songplayer.currentLRCPlayer
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
    height: deviceHeight,
  },
});
