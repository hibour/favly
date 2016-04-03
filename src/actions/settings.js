var offline = require('react-native-simple-store')

var actions = exports = module.exports

exports.CHANGE_LOCALE = 'CHANGE_LOCALE'
exports.OFFLINE_SETTINGS_LOADED = 'OFFLINE_SETTINGS_LOADED'

exports.changeLocale = function(locale) {
  return {
    type: actions.CHANGE_LOCALE,
    locale: locale,
  }
}

exports.loadOfflineSettings = function() {
  return dispatch => {
    offline.get('settings').then(settings => {
      dispatch({
        type: actions.OFFLINE_SETTINGS_LOADED,
        settings: settings || {}
      })
    })
  }
}
