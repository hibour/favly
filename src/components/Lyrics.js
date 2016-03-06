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

const CommonStyle = require('../css/common.js')
var LRC = require('../utils/lrc')

class Lyrics extends Component {

  constructor(props) {
    super(props);
    this.createLRCPlayerIfNeeded(this.props.lyrics);
    this.state = {
      lyricsParsed: false
    };
  }

  outputHandler(line, extra) {
    if(!line){ return }
    console.log(line);
    this.updateState({currentPosition: {$set: extra.lineNum}});
  }

  updateState(state) {
    this.setState(React.addons.update(this.state, state));
  }

  createLRCPlayerIfNeeded(lyricData) {
    if (this.lrcPlayer || !lyricData) {
      return;
    }
    InteractionManager.runAfterInteractions(function() {
      this.lrcPlayer = new LRC.Lrc(lyricData, this.outputHandler.bind(this));
      this.updateState({lyricsParsed: {$set: true}});
    }.bind(this));
  }

  render() {
    this.createLRCPlayerIfNeeded(this.props.lyrics);

    var txts = ['Loading'];
    var highlightLine = 0;
    if (this.state.lyricsParsed) {
      highlightLine = this.lrcPlayer.findLineAt(this.props.currentTime);
      txts = this.lrcPlayer.txts;
      console.log(">> Lyrics being rendered ", this.props.currentTime, highlightLine);
    }

    return (
        <View style={styles.container}>
          <Text style={styles.lyricLine}>{txts[highlightLine]}</Text>
        </View>
    );
  }
}
module.exports = Lyrics;

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
