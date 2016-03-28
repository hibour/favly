var actions = exports = module.exports

exports.CHANGE_TAB = 'CHANGE_TAB'

exports.changeTab = function(tab) {
  return {
    type: actions.CHANGE_TAB,
    tab: tab,
  }
}
