import {attendStudent, fetchLectureInfo, getStdAttendanceStatus} from './provider'

// Actions

export const ATTEND_STUDENT_SENT = 'ATTEND_STUDENT_SENT'
export const ATTEND_STUDENT_SUCCESS = 'ATTEND_STUDENT_SUCCESS'
export const ATTEND_STUDENT_FAILURE = 'ATTEND_STUDENT_FAILURE'

export const CHECK_ATTENDANCE_STATUS_SENT = 'CHECK_ATTENDANCE_STATUS_SENT'
export const CHECK_ATTENDANCE_STATUS_SUCCESS = 'CHECK_ATTENDANCE_SUCCESS'
export const CHECK_ATTENDANCE_STATUS_FAILURE = 'CHECK_ATTENDANCE_FAILURE'

// Action Creators

export const attendStudentSent = () => ({
  type: ATTEND_STUDENT_SENT,
})

export const attendStudentSuccess = () => ({
  type: ATTEND_STUDENT_SUCCESS,
})
export const attendStudentFailure = err => ({
  type: ATTEND_STUDENT_FAILURE,
  payload: err,
})
export const makeStudentAttend = (LectureId, secret) => async dispatch => {
  dispatch(attendStudentSent())
  try {
    await attendStudent(LectureId, secret)
    dispatch(attendStudentSuccess())
  } catch (error) {
    dispatch(attendStudentFailure(error.message))
  }
}

export const checkAttendanceStatusSent = () => ({
  type: CHECK_ATTENDANCE_STATUS_SENT,
})

export const checkAttendanceStatusSuccess = LectureStatus => ({
  type: CHECK_ATTENDANCE_STATUS_SUCCESS,
  payload: LectureStatus,
})

export const checkAttendanceStatusFailure = error => ({
  type: CHECK_ATTENDANCE_STATUS_FAILURE,
  payload: error,
})
export const checkAttendanceStatus = LectureId => async dispatch => {
  dispatch(checkAttendanceStatusSent())
  try {
    const LectureStatus = await fetchLectureInfo(LectureId)
    dispatch(checkAttendanceStatusSuccess(LectureStatus))
  } catch (error) {
    dispatch(checkAttendanceStatusFailure(error.message))
  }
}

const dispatcher = (type, payload) => ({type, payload})

export const CHECK_STD_ATTENDANCE_STATUS_SENT = 'CHECK_STD_ATTENDANCE_STATUS_SENT'
export const CHECK_STD_ATTENDANCE_STATUS_SUCCESS = 'CHECK_STD_ATTENDANCE_STATUS_SUCCESS'
export const CHECK_STD_ATTENDANCE_STATUS_FAILURE = 'CHECK_STD_ATTENDANCE_STATUS_FAILURE'

export const checkStdAttendanceStatus = lectureId => async dispatch => {
  dispatch(dispatcher(CHECK_STD_ATTENDANCE_STATUS_SENT, null))
  try {
    const isAttend = await getStdAttendanceStatus(lectureId)
    dispatch(dispatcher(CHECK_STD_ATTENDANCE_STATUS_SUCCESS, isAttend))
  } catch (error) {
    dispatch(dispatcher(CHECK_STD_ATTENDANCE_STATUS_FAILURE, error.message))
  }
}
