import { createStore, combineReducers, applyMiddleware } from 'redux'
import authReducer from '../features/auth/authReducer';
import codesReducer from '../features/courses_available/codes_reducer';
import SchedulesReducer from '../features/courses_available/schedules_reducer';
import changeStudentAttendanceReducer from '../features/lecture_attendance/change_attendance_reducer' 
import getOPenLecturesReducer from '../features/open_lectures/Reducers'
import thunk from 'redux-thunk';
import checkAttendanceStatusReducer from '../features/lecture_attendance/check_attendance_status_reducer'
export const reducers = combineReducers({
    auth: authReducer,
    codes:codesReducer,
    schedules: SchedulesReducer,
    studentAttendance:changeStudentAttendanceReducer,
    openLectures:getOPenLecturesReducer,
    checkAttendacneStatus:checkAttendanceStatusReducer

})

export default store = createStore(reducers, applyMiddleware(thunk));