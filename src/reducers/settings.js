const {
  CHANGE_LOCALE,
} = require('../actions/settings')

const initialState = {
  locale: 'en', // default
}
module.exports = function reducer(state = initialState, action) {
    switch (action.type) {
        case CHANGE_LOCALE:
            console.log(">>>> changed the locale", action.locale);
            return {
              ...state,
              locale: action.locale,
            };
        default:
            return state;
    }
}
