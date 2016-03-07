import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';

var {
  height: deviceHeight
} = Dimensions.get('window');

import FavlyTabBar from '../components/FavlyTabBar';
import SongListWrapper from '../components/SongListWrapper';
import RecordingListWrapper from '../components/RecordingListWrapper';

import ScrollableTabView, { DefaultTabBar, ScrollableTabBar, } from 'react-native-scrollable-tab-view';

import Icon from 'react-native-vector-icons/Ionicons';
import Constants from '../utils/constants.js'
import CommonStyle from '../css/common.js'

const Firebase = require('firebase');

class Home extends Component {
  constructor(props) {
    super(props);
    this.database = new Firebase(Constants.FIREBASEURL);
  }

  render() {
    return (<View style={styles.container}>
      <ScrollableTabView
        initialPage={0}
        tabBarPosition="bottom"
        renderTabBar={() => <FavlyTabBar />}>

        <ScrollView tabLabel="music-note" style={styles.tabView}>
          <SongListWrapper></SongListWrapper>
        </ScrollView>

        <ScrollView tabLabel="ios-albums" style={styles.tabView}>
          <View style={styles.card}>
            <Text>Albums</Text>
          </View>
        </ScrollView>

        <ScrollView tabLabel="ios-recording" style={styles.tabView}>
          <RecordingListWrapper></RecordingListWrapper>
        </ScrollView>

        <ScrollView tabLabel="more" style={styles.tabView}>
          <View style={styles.card}>
            <Text>Settings</Text>
          </View>
        </ScrollView>

      </ScrollableTabView>
    </View>);
  }
};

module.exports = Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },

  tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },

  card: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: deviceHeight - 80,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 1, height: 1, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  icon: {
    width: 300,
    height: 300,
    alignSelf: 'center',
  },
});
