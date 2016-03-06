const React = require('react-native')
const {StyleSheet} = React

const constants = {
  primaryColor: '#3B5998',
  primaryBackground: '#FFFFFF',
  secondaryColor: '#24CE84'
};

var styles = StyleSheet.create({
  container: {
    backgroundColor: constants.primaryBackground,
    flex: 1,
  },
  listview: {
    flex: 1,
  },
  center: {
    textAlign: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: constants.primaryColor,
    borderColor: 'transparent',
    borderWidth: 1,
    paddingLeft: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
})

module.exports.styles = styles
module.exports.constants = constants;
