'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
  Component,
} = React;

import {styles as CommonStyles} from '../css/common.js'
import moment from 'moment';

class RecordingItem extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var recording = this.props.recording;
    return (
      <TouchableHighlight onPress={this.props.onPress} >
        <View style={[CommonStyles.listItem]}>
          <Image source={{uri: recording.thumbnail}} style={styles.thumbnail}/>
          <View style={styles.rightContainer}>
            <Text style={[CommonStyles.titleText, styles.title]}>{recording.title}</Text>
            <Text style={[CommonStyles.subtitleText, styles.date]}>{moment(recording.time).toNow(true)}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
module.exports = RecordingItem;

const styles = StyleSheet.create({
  rightContainer: {
    flex: 1,
    marginLeft: 4,
  },
  thumbnail: {
    width: 84,
    height: 84,
    borderRadius: 4,
  },

  title: {
    marginBottom: 4,
  },
  date: {
  },
});
