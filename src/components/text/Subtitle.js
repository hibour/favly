'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
} = React;

import {styles as CommonStyles} from '../../css/common';

class Subtitle extends Text {
  defaultProps = {
    customFont: false
  };

  render() {
    var props = Object.assign([], this.props);

    if (this.props.customFont) {
      return super.render();
    }
    var style = CommonStyles.subtitleText;
    if (Array.isArray(this.props.style)){
      props.style.push(style);
    } else if (props.style) {
      props.style = [props.style, style];
    } else {
      props.style = style;
    }
    this.props = props;
    return super.render();
  }
}

export default Subtitle;
