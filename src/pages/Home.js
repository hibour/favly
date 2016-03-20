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
import {styles as CommonStyles} from '../css/common.js';

const Firebase = require('firebase');

class Home extends Component {
  constructor(props) {
    super(props);
    this.database = new Firebase(Constants.FIREBASEURL);
  }

  render() {
    return (<View style={[CommonStyles.container, styles.container]}>
      <ScrollableTabView
        initialPage={0}
        tabBarPosition="bottom"
        renderTabBar={() => <FavlyTabBar />}>

        <ScrollView tabLabel="music-note" style={[CommonStyles.homeTabView, styles.tabView]}>
          <SongListWrapper></SongListWrapper>
        </ScrollView>

        <ScrollView tabLabel="ios-recording" style={[CommonStyles.homeTabView, styles.tabView]}>
          <RecordingListWrapper></RecordingListWrapper>
        </ScrollView>

        <ScrollView tabLabel="more" style={[CommonStyles.homeTabView, styles.tabView]}>
          <View style={[CommonStyles.container]}>
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
    marginTop: 50,
  },

  tabView: {
  },
});
