const { createStore, applyMiddleware } = require('redux')
const thunk = require('redux-thunk').default
const reducer = require('../reducers')
const syncOffline = require('./syncOffline')

const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore)

module.exports = function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState)
  syncOffline(store)
  return store
}
