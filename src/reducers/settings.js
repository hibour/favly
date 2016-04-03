const {
  CHANGE_LOCALE,
  OFFLINE_SETTINGS_LOADED,
} = require('../actions/settings')

const initialState = {
  locale: 'en', // default
}
module.exports = function reducer(state = initialState, action) {
    switch (action.type) {
        case CHANGE_LOCALE:
            return {
              ...state,
              locale: action.locale,
            }
        case OFFLINE_SETTINGS_LOADED:
          return {
            ...state,
            locale: action.settings.locale || state.locale,
          }
        default:
            return state;
    }
}
