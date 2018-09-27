import { createStore, combineReducers, applyMiddleware } from 'redux'
import authReducer from '../features/auth/authReducer';
import codesReducer from '../features/courses_available/codes_reducer';
import SchedulesReducer from '../features/courses_available/schedules_reducer';
import LectureAttendanceReducer from '../features/attendance_prof/attListreducer';
import chngStudentAttendanceReducer from '../features/attendance_prof/chngStdAttReducer';
import AttendanceStatusReducer from '../features/attendance_prof/reducer_attendanceStatus';
import LectureReducer from '../features/prof_created_lectures/reducers';

import openNewLecture from '../features/courses_available/newLecture_reducer';
import submitAttendanceReducer from '../features/attendance_prof/reducer_submitAttendance';


import thunk from 'redux-thunk';

export const reducers = combineReducers({
    auth: authReducer,
    codes:codesReducer,
    schedules: SchedulesReducer,
    prof: combineReducers({
       attendanceList:LectureAttendanceReducer,
       chngStuAtt: chngStudentAttendanceReducer,
       attendanceStatus: AttendanceStatusReducer,
       submitAttendance: submitAttendanceReducer,
    }),
    lectures: LectureReducer,
    openNewLec: openNewLecture,
})

export default store = createStore(reducers, applyMiddleware(thunk));