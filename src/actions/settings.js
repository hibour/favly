var actions = exports = module.exports

exports.CHANGE_LOCALE = 'CHANGE_LOCALE'

exports.changeLocale = function(locale) {
  return {
    type: actions.CHANGE_LOCALE,
    locale: locale,
  }
}
