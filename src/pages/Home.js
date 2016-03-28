import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';

import { connect } from 'react-redux'
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
        ref="tabview"
        initialPage={this.props.currentTab}
        tabBarPosition="bottom"
        renderTabBar={() => <FavlyTabBar />}>

        <ScrollView tabLabel="music-note" style={[CommonStyles.homeTabView]}>
          <SongListWrapper></SongListWrapper>
        </ScrollView>

        <ScrollView tabLabel="ios-recording" style={[CommonStyles.homeTabView]}>
          <RecordingListWrapper></RecordingListWrapper>
        </ScrollView>

        <ScrollView tabLabel="more" style={[CommonStyles.homeTabView]}>
          <View style={[CommonStyles.container]}>
            <Text>Settings</Text>
          </View>
        </ScrollView>

      </ScrollableTabView>
    </View>);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.currentTab != nextProps.currentTab;
  }

  componentDidUpdate(prevProps, prevState) {
    //this.refs.tabView.goToPage(this.props.currentTab);
  }
}

function mapStateToProps(state) {
  return {
    currentTab: state.home.currentTab,
  }
}
module.exports = connect(mapStateToProps)(Home)

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
  },
});
