import { createStore, combineReducers, applyMiddleware } from 'redux'
import authReducer from '../features/auth/authReducer';
import codesReducer from '../features/courses_available/codes_reducer';
import SchedulesReducer from '../features/courses_available/schedules_reducer';
import LectureAttendanceReducer from '../features/attendance_prof/attListreducer';
import chngStudentAttendanceReducer from '../features/attendance_prof/chngStdAttReducer';


import thunk from 'redux-thunk';

export const reducers = combineReducers({
    auth: authReducer,
    codes:codesReducer,
    schedules: SchedulesReducer,
    prof: combineReducers({
       attendanceList:LectureAttendanceReducer,
       chngStuAtt: chngStudentAttendanceReducer
    })
})

export default store = createStore(reducers, applyMiddleware(thunk));