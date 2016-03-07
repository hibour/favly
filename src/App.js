'use strict';

var React = require('react-native');
var {AppRegistry, Navigator, StyleSheet, Text, View, Component} = React;

var RNRF = require('react-native-router-flux');
var {Route, Schema, Animations} = RNRF;

var Register = require('./pages/Register');
var Login = require('./pages/Login');
var Home = require('./pages/Home');
var SongDetails = require('./pages/SongDetails');

import { createStore, bindActionCreators } from 'redux'
import { Provider, connect } from 'react-redux'
const configureStore = require('./store/configureStore')

const store = configureStore();
const Router = connect()(RNRF.Router);

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Router name="root">
                    <Schema name="modal" sceneConfig={Navigator.SceneConfigs.FloatFromBottom}/>
                    <Schema name="default" sceneConfig={Navigator.SceneConfigs.FloatFromRight}/>
                    <Schema name="withoutAnimation"/>

                    <Route name="login" component={Login} title="Login"/>
                    <Route name="register" component={Register} title="Register" schema="withoutAnimation"/>

                    <Route name="songdetails" component={SongDetails} title="Song"/>
                    <Route name="home" initial={true} component={Home} wrapRouter={true} title="Home"/>
                </Router>
            </Provider>
        );
    }
}

module.exports = App;
