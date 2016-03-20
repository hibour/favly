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

import {styles as CommonStyles} from '../css/common.js';

class SongItem extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var song = this.props.song;
    return (
      <TouchableHighlight onPress={this.props.onPress} >
        <View style={[CommonStyles.listItem]}>
          <Image source={{uri: song.thumbnail}} style={styles.thumbnail}/>
          <View style={styles.rightContainer}>
            <Text style={[CommonStyles.titleText, styles.title]}>{song.title}</Text>
            <Text style={[CommonStyles.subtitleText, styles.year]}>{song.year}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
module.exports = SongItem;

const styles = StyleSheet.create({
  thumbnail: {
    width: 84,
    height: 84,
    borderRadius: 4,
  },

  rightContainer: {
    flex: 1,
    marginLeft: 4,
  },

  title: {
    marginBottom: 4,
  },
  year: {
  },
});
