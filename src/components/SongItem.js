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
            <View style={styles.subDetails}>
              <Text style={[CommonStyles.subtitleText, styles.album]}>{song.album}</Text>
              <Text style={[CommonStyles.subtitleText, styles.year]}>{song.year}</Text>
            </View>
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
    height: 64,
    borderRadius: 4,
    marginLeft: 8,
  },

  rightContainer: {
    flex: 1,
    marginLeft: 6,
  },

  subDetails: {
    flexDirection: 'row',
  },

  title: {
    marginBottom: 2,
  },

  album: {
    flex: 3,
  },

  year: {
    flex: 1,
    textAlign: 'right',
  },
});
