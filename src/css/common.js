const React = require('react-native')
const { StyleSheet, Dimensions } = React

const window = Dimensions.get('window');

const constants = {
  primaryColor: '#00afef',
  primaryBackground: '#F5FCFF',
  secondaryColor: '#24CE84',
  highlightBackground: '#FFFFFF'
};

const styles = StyleSheet.create({
  navigationBarStyle: {
    backgroundColor: constants.primaryColor,
  },
  navigationBarTitleStyle: {
    color: constants.secondaryColor,
  },

  container: {
    flex: 1,
    backgroundColor: constants.primaryBackground,
  },

  homeTabView: {
    flex: 1,
    padding: 10,
    backgroundColor: constants.primaryBackground,
    height: 600,
  },

  listview: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: constants.primaryBackground,
  },

  listItem: {
    flex: 1,
    flexDirection: 'row',
    padding: 4,
    marginBottom: 4,
    backgroundColor: constants.highlightBackground,
    borderRadius: 4,
    width: window.width - 10,
  },

  center: {
    textAlign: 'center',
  },

  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    color: constants.primaryColor,
  },
  subtitleText: {
    fontSize: 14,
    textAlign: 'left',
    color: constants.secondaryColor,
  },


  actionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: constants.primaryColor,
    borderColor: 'transparent',
    borderWidth: 1,
    padding: 8,
    justifyContent: 'center',
  },
  actionButton2: {
    backgroundColor: constants.secondaryColor,
    borderColor: 'transparent',
    borderWidth: 1,
    padding: 8,
    justifyContent: 'center',
  },
})

module.exports.styles = styles
module.exports.constants = constants;
