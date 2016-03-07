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
} = React;

const CommonStyle = require('../css/common.js')
const moment = require('moment');

class RecordingItem extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var recording = this.props.recording;
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.container}>
          <Text style={styles.title}>{recording.title}</Text>
          <Text style={styles.date}>{moment(recording.time).toNow(true)}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}
module.exports = RecordingItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'left',
  },
  date: {
    textAlign: 'left',
  },
});
