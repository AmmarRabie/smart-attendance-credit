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
import changeStudentAttendanceReducer from '../features/lecture_attendance/change_attendance_reducer' 
import getOPenLecturesReducer from '../features/open_lectures/Reducers'
import checkAttendanceStatusReducer from '../features/lecture_attendance/check_attendance_status_reducer'

import thunk from 'redux-thunk';
// import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

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
    studentAttendance:changeStudentAttendanceReducer,
    openLectures:getOPenLecturesReducer,
    checkAttendacneStatus:checkAttendanceStatusReducer,
})


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth']
}
// const persistedReducer = persistReducer(persistConfig, reducers)
  
export default store = createStore(reducers, applyMiddleware(thunk));
// export const persistor = persistStore(store)

export const getStoreToken = () => store.getState().auth.userData.token