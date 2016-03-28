'use strict';

var React = require('react-native');
var {AppRegistry, Navigator, StyleSheet, Text, View, Component} = React;

var RNRF = require('react-native-router-flux');
var {Route, Schema, Animations} = RNRF;

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import SongDetails from './pages/SongDetails';
import RecordingDetails from './pages/RecordingDetails';
import {styles as CommonStyles} from './css/common.js';

import codePush from "react-native-code-push";
import { Provider, connect } from 'react-redux'
const configureStore = require('./store/configureStore')

const store = configureStore();
const Router = connect()(RNRF.Router);

class App extends Component {
    componentDidMount() {
      console.log(">> Code Push Syncing./");
      codePush.sync({ updateDialog: { title: "An update is available!" } });
    }
    render() {
        return (
            <Provider store={store}>
                <Router name="root">
                    <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
                    <Schema name="default" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
                    <Schema name="withoutAnimation"/>

                    <Route name="login" component={Login} title="Login" titleStyle={styles.title}/>
                    <Route name="register" component={Register} title="Register" schema="withoutAnimation"/>

                    <Route name="songdetails" component={SongDetails}
                    navigationBarStyle={CommonStyles.navigationBarStyle}
                    titleStyle={CommonStyles.navigationBarTitleStyle}                    
                    />
                    <Route name="recordingdetails" component={RecordingDetails}
                    navigationBarStyle={CommonStyles.navigationBarStyle}
                    titleStyle={CommonStyles.navigationBarTitleStyle}
                    />
                    <Route name="home"
                      initial={true}
                      component={Home}
                      title="Kuhu"
                      navigationBarStyle={CommonStyles.navigationBarStyle}
                      titleStyle={CommonStyles.navigationBarTitleStyle}
                      />
                </Router>
            </Provider>
        );
    }
}

module.exports = App;
const styles = StyleSheet.create({
  title: {
    textAlign: 'center'
  }
});
