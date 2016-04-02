'use strict';
var React = require('react-native');
var {
  StyleSheet,
  View,
  Picker,
  Component,
} = React;

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SettingsActions from '../actions/settings'

import Title from './text/Title'

class Settings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={this.props.style}>
        <View style={styles.row}>
          <Title>Preferred Language</Title>
          <Picker style={styles.control}
            selectedValue={this.props.locale}
            mode='dropdown'
            onValueChange={(locale) => this.props.changeLocale(locale)}>
            <Picker.Item label="Telugu" value="te" />
            <Picker.Item label="English" value="en" />
          </Picker>
        </View>
      <View style={styles.separator} />
    </View>);
  }
}

function mapStateToProps(state) {
  return {
    locale: state.settings.locale,
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch)
}
module.exports = connect(mapStateToProps, mapDispatchToProps)(Settings)

const styles = StyleSheet.create({
  row: {
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    flex: 1,
    flexDirection: 'column',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#bbbbbb',
  },
  control: {
    height: 10,
  }
});
