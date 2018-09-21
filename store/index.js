import { createStore, combineReducers, applyMiddleware } from 'redux'
import authReducer from '../features/auth/authReducer';
import codesReducer from '../features/courses_available/codes_reducer';
import SchedulesReducer from '../features/courses_available/schedules_reducer';
import LectureAttendanceReducer from '../features/attendance_prof/attListreducer';
import chngStudentAttendanceReducer from '../features/attendance_prof/chngStdAttReducer';
import AttendanceStatusReducer from '../features/attendance_prof/reducer_attendanceStatus';


import thunk from 'redux-thunk';
import submitAttendanceReducer from '../features/attendance_prof/reducer';

export const reducers = combineReducers({
    auth: authReducer,
    codes:codesReducer,
    schedules: SchedulesReducer,
    prof: combineReducers({
       attendanceList:LectureAttendanceReducer,
       chngStuAtt: chngStudentAttendanceReducer,
       attendanceStatus: AttendanceStatusReducer,
       submitAttendance: submitAttendanceReducer,
    })
})

export default store = createStore(reducers, applyMiddleware(thunk));