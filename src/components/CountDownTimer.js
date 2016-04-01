'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Component,
} = React;

import Animatable from 'react-native-animatable'

class CountDownTimer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      count: props.initialValue
    }
  }

  render() {
    return (
    <Text style={[styles.counter]}>
      {this.props.text}
    </Text>);
  }

  componentDidUpdate() {
    var active = this.props.rowID == this.props.lyricIndex;
    if (active) {
      // Scroll to the line above the highlighted one. to give some context.
      var scrollIndex = this.props.lyricIndex - 1;
      this.props.scrollDelegate.scrollTo(
        Math.max(scrollIndex * LineHeight, 0)
      );
    }
  }
}

module.exports = CountDownTimer;

const styles = StyleSheet.create({
  counter: {
    fontWeight: 'bold',
    fontSize: 32,
    color: CommonConstants.primaryColor,
  },
});
