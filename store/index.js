import { createStore, combineReducers, applyMiddleware } from 'redux'
import authReducer from '../features/auth/authReducer';
import codesReducer from '../features/courses_available/codes_reducer';
import SchedulesReducer from '../features/courses_available/schedules_reducer';
import changeStudentAttendanceReducer from '../features/attendance_student/changeStudentAttendanceReducer' 
import getOPenLecturesReducer from '../features/attendance_student/getOpenLecturesReducer'
import thunk from 'redux-thunk';

export const reducers = combineReducers({
    auth: authReducer,
    codes:codesReducer,
    schedules: SchedulesReducer,
    studentAttendance:changeStudentAttendanceReducer,
    openLectures:getOPenLecturesReducer

})

export default store = createStore(reducers, applyMiddleware(thunk));