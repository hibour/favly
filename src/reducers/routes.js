var RNRF = require('react-native-router-flux');
var {Actions} = RNRF;
const {
  ADD_RECORDING,
  DELETE_RECORDING,
} = require('../actions/recordings')

const initialState = {
}
module.exports = function reducer(state = initialState, action) {
    switch (action.type) {
        case Actions.BEFORE_ROUTE:
            //console.log("BEFORE_ROUTE:", action);
            return state;
        case Actions.AFTER_ROUTE:
            //console.log("AFTER_ROUTE:", action);
            return state;
        case Actions.AFTER_POP:
            //console.log("AFTER_POP:", action);
            return state;
        case Actions.BEFORE_POP:
            //console.log("BEFORE_POP:", action);
            return state;
        case Actions.AFTER_DISMISS:
            //console.log("AFTER_DISMISS:", action);
            return state;
        case Actions.BEFORE_DISMISS:
            //console.log("BEFORE_DISMISS:", action);
            return state;
        default:
            return state;
    }

}
