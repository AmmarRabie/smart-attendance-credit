import {
  SUBMIT_ATTENDANCE_SUCCESS,
  SUBMIT_ATTENDANCE_FAILURE,
  SUBMIT_ATTENDANCE_TOKEN,
} from './actions'

const defaultInitialState = {
  message: undefined,
  error: undefined,
}

const submitAttendanceReducer = (state = defaultInitialState, action) => {
  switch (action.type) {
    case SUBMIT_ATTENDANCE_SUCCESS:
      return {
        ...state,
        message: action.payload,
        error: undefined,
      }
    case SUBMIT_ATTENDANCE_FAILURE:
      return {
        ...state,
        error: action.payload,
      }
    case SUBMIT_ATTENDANCE_TOKEN:
      return defaultInitialState
    default:
      return state
  }
}

export default submitAttendanceReducer
