import {
  ATTEND_STUDENT_SENT,
  ATTEND_STUDENT_SUCCESS,
  ATTEND_STUDENT_FAILURE,
  CHECK_STD_ATTENDANCE_STATUS_SUCCESS,
} from './actions'

const studentAttendanceInitialState = {
  isAttend: false,
  studentAttendError: null,
  studentAttendLoading: false,
}

const changeStudentAttendanceReducer = (state = studentAttendanceInitialState, action) => {
  switch (action.type) {
    case ATTEND_STUDENT_SENT:
      return {
        ...state,
        studentAttendLoading: true,
        studentAttendError: null,
      }
    case ATTEND_STUDENT_SUCCESS:
      return {
        ...state,
        studentAttendLoading: false,
        studentAttendError: null,
        isAttend: true,
      }
    case ATTEND_STUDENT_FAILURE:
      return {
        ...state,
        studentAttendLoading: false,
        studentAttendError: action.payload,
      }
    case CHECK_STD_ATTENDANCE_STATUS_SUCCESS:
      return {
        ...state,
        isAttend: action.payload,
      }
    default:
      return state
  }
}
export default changeStudentAttendanceReducer
