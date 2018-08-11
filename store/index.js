import {createStore, combineReducers, applyMiddleware} from 'redux'
import authReducer from '../features/auth/authReducer';
import codesReducer from '../features/courses_available/reducer';
import thunk from 'redux-thunk';

export const reducers = combineReducers({
    auth: authReducer,
    codes:codesReducer
})

export default store = createStore(reducers, applyMiddleware(thunk));