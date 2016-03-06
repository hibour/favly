'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  Component,
  ListView,
} = React;
import {Actions} from 'react-native-router-flux'

import SongItem from './SongItem';

class SongList extends Component {
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    dataSource = dataSource.cloneWithRows(this.props.songs);
    this.state = {
      dataSource: dataSource,
      loaded: true,
    };
  }

  render() {
    return (<ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderSong}
        style={styles.listView}
      />);
  }

  renderSearchBar() {
      return (
        <View style={styles.searchCell}>
          <TextInput onChange={this.onSearchChange} placeholder={'Search a Track'} style={styles.searchContainer}/>
        </View>
      )
    }

  renderSong(song) {
    return (<SongItem song={song} onPress={function() {
      Actions.songdetails({song: song});
    }}/>);
  }
}

module.exports = SongList;

const styles = StyleSheet.create({
  listView: {
    paddingTop: 20,
    backgroundColor: '#FFFFFF',
  },
  searchCell: {
    flex: 1,
    flexDirection: 'row'
  },
  searchContainer: {
    height: 40,
    width: 100,
    flex: 1,
    margin: 4,
    padding: 4,
    borderColor: 'gray',
    color: 'black',
    borderWidth: 1
   },
});
