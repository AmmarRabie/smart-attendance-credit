import {createStore, combineReducers, applyMiddleware} from 'redux'
import authReducer from '../features/auth/authReducer';
import thunk from 'redux-thunk';

export const reducers = combineReducers({
    auth: authReducer,
})

export default store = createStore(reducers, applyMiddleware(thunk));