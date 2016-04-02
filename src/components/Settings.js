'use strict';
var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
  Picker,
  Component,
} = React;

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SettingsActions from '../actions/settings'

class Settings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<View style={this.props.style}>
      <Picker
        selectedValue={this.props.locale}
        onValueChange={(locale) => this.props.changeLocale(locale)}>
        <Picker.Item label="Telugu" value="te" />
        <Picker.Item label="English" value="en" />
      </Picker>
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
});
