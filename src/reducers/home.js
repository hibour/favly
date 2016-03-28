const {
  CHANGE_TAB,
} = require('../actions/home')

const initialState = {
  currentTab: 0,
}
module.exports = function reducer(state = initialState, action) {
    switch (action.type) {
        case CHANGE_TAB:
            console.log(">>>> changed the tab", action.tab);
            return {
              ...state,
              currentTab: action.tab,
            };
        default:
            return state;
    }

}
