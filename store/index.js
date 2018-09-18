import { createStore, combineReducers, applyMiddleware } from 'redux'
import authReducer from '../features/auth/authReducer';
import codesReducer from '../features/courses_available/codes_reducer';
import SchedulesReducer from '../features/courses_available/schedules_reducer';
import LectureAttendanceReducer from '../features/attendance_prof/reducer';


import thunk from 'redux-thunk';

export const reducers = combineReducers({
    auth: authReducer,
    codes:codesReducer,
    schedules: SchedulesReducer,
    prof:LectureAttendanceReducer,
})

export default store = createStore(reducers, applyMiddleware(thunk));