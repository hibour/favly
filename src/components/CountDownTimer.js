'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Component,
} = React;

import Animatable from 'react-native-animatable'
import {constants as CommonConstants} from '../css/common';

class CountDownTimer extends Component {

  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      count: props.initialValue,
      timeRemaining: props.initialValue + 1,
      timeoutId: null,
    }
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.state.timeoutId);
  }

  start() {
    if (this.state.timeRemaining >= 0) {
      this.tick();
    }
  }

  tick() {
    if (this.state.timeoutId) { clearTimeout(this.state.timeoutId); }

    if (!this.mounted) {
      return;
    }

    var countdownComplete = this.state.timeRemaining <= 1;
    this.setState({
      timeoutId: countdownComplete ? null : setTimeout(this.tick.bind(this), 1000),
      timeRemaining: this.state.timeRemaining - 1,
    });
    if (countdownComplete && this.props.onFinish) {
      this.props.onFinish();
    }
  }

  render() {
    var timeRemaining = this.state.timeRemaining;
    return (
    this.state.timeoutId ?
      <Animatable.View ref={(animatedView) => {
        if (!animatedView) {
          return
        }
        animatedView.zoomIn(900).then((endState) => {
          animatedView.zoomOut(50);
        })
      }} style={this.props.style}>
      <Text style={[styles.counter]}>
        {timeRemaining}
      </Text>
      </Animatable.View> : <View/>);
  }
}

module.exports = CountDownTimer;

const styles = StyleSheet.create({
  counter: {
    fontWeight: 'bold',
    fontSize: 96,
    color: CommonConstants.primaryColor,
    backgroundColor: 'transparent',
    textShadowColor: 'black',
    textShadowRadius: 1,
    textShadowOffset: {height: 1, width: 0}
  },
});
