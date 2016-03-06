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
class SongItem extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var song = this.props.song;
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.container}>
          <Image source={{uri: song.thumbnail}} style={styles.thumbnail}/>
          <View style={styles.rightContainer}>
            <Text style={styles.title}>{song.title}</Text>
            <Text style={styles.year}>{song.year}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}
module.exports = SongItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  rightContainer: {
    flex: 1,
  },
  thumbnail: {
    width: 84,
    height: 84,
    marginRight: 4,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'left',
  },
  year: {
    textAlign: 'left',
  },
});
