'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Component,
  InteractionManager,
  ListView,
} = React;

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SongPlayerActions from '../actions/songplayer'
import {constants as CommonConstants} from '../css/common.js';

var LineHeight = 46;

class LyricLine extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var active = this.props.rowID == this.props.lyricIndex;
    var upcomingActive = !active && this.props.rowID == this.props.upcomingLyricIndex;
    return (<Text style={[styles.lyricLine, active && styles.active, upcomingActive && styles.upcomingActive]}>
      {this.props.text}
    </Text>);
  }

  componentDidUpdate() {
    var active = this.props.rowID == this.props.lyricIndex;
    if (active) {
      // Scroll to the line above the highlighted one. to give some context.
      var scrollIndex = this.props.lyricIndex - 1;
      this.props.scrollDelegate.scrollTo(
        Math.max(scrollIndex * LineHeight, 0)
      );
    }
  }
}

function mapStateToProps(state) {
  return {
    lyricIndex: state.songplayer.currentLyricIndex,
    upcomingLyricIndex: state.songplayer.upcomingLyricIndex,
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(SongPlayerActions, dispatch)
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(LyricLine)

const styles = StyleSheet.create({
  lyricLine: {
    fontSize: 20,
    textAlign: 'center',
    height: LineHeight,
  },

  active: {
    fontWeight: 'bold',
    color: CommonConstants.primaryColor,
  },

  upcomingActive: {
    fontWeight: 'bold',
  }
});
