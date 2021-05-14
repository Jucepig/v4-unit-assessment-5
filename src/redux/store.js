import { createStore, combineReducers } from 'redux'
import reducer from './reducer'

const rootReducer = combineReducers({
  reducer: reducer
})

export default createStore(rootReducer);