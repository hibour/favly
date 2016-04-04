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

import Constants from '../utils/constants'
import Title from './text/Title';
import Subtitle from './text/Subtitle';

class RecordingItem extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var recording = this.props.recording;
    return (
      <TouchableHighlight onPress={this.props.onPress} >
        <View style={[CommonStyles.listItem]}>
          <Image source={{uri: Constants.getCDNUrl(recording.thumbnail)}} style={styles.thumbnail}/>
          <View style={styles.rightContainer}>
            <Title style={styles.title}>{recording.title}</Title>
            <Subtitle style={styles.date}>{moment(recording.time).toNow(true)}</Subtitle>
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
    height: 64,
    borderRadius: 4,
  },

  title: {
    marginBottom: 4,
  },
  date: {
  },
});
