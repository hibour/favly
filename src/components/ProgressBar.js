var React = require('react-native');
var {
  Animated,
  Easing,
  StyleSheet,
  View,
  Text,
  Component,
} = React;

class ProgressBar extends Component {

  constructor(props) {
      super(props);
      this.state = {
        progress: new Animated.Value(this.props.initialProgress || 0)
      };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.progress >= 0 && this.props.progress != prevProps.progress) {
      this.update();
    }
  }

  render() {
    var fillWidth = 0;
    if (this.state && this.state.progress) {
      fillWidth = this.state.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0 * this.props.style.width, 1 * this.props.style.width],
      });
    }

    return (
      <View style={[styles.background, this.props.backgroundStyle, this.props.style]}>
        <Animated.View style={[styles.fill, this.props.fillStyle, { width: fillWidth }]}/>
      </View>
    );
  }

  update() {
    Animated.timing(this.state.progress, {
      easing: this.props.easing,
      duration: this.props.easingDuration,
      toValue: this.props.progress
    }).start();
  }
}

ProgressBar.defaultProps = {
  style: styles,
  easing: Easing.inOut(Easing.ease),
  easingDuration: 500
};


module.exports = ProgressBar;

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#bbbbbb',
    height: 5,
    overflow: 'hidden'
  },
  fill: {
    backgroundColor: '#3b5998',
    height: 5
  }
});
