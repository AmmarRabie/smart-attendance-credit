import {fetchLectureAttendance, postStudentAttendance} from '../../DataProviders'

import {
  changeLectureAttendanceStatus as apiChangeStatus,
  submitAttendance as apiSubmitAttendance,
} from './provider'

export const GET_LECTURE_ATTENDANCE_BEGIN = 'GET_LECTURE_ATTENDANCE_BEGIN'
export const GET_LECTURE_ATTENDANCE_SUCCESS = 'GET_LECTURE_ATTENDANCE_SUCCESS'
export const GET_LECTURE_ATTENDANCE_FAILURE = 'GET_LECTURE_ATTENDANCE_FAILURE'

export const getLectureAttendanceBegin = () => ({
  type: GET_LECTURE_ATTENDANCE_BEGIN,
})

export const getLectureAttendanceSuccess = attendanceList => ({
  type: GET_LECTURE_ATTENDANCE_SUCCESS,
  payload: attendanceList,
})

export const getLectureAttendanceFailure = error => ({
  type: GET_LECTURE_ATTENDANCE_FAILURE,
  payload: error,
})

export const GetLectureAttendance = lectureId => async dispatch => {
  dispatch(getLectureAttendanceBegin())
  try {
    const lecture = await fetchLectureAttendance(lectureId)
    dispatch(dispatcher(GET_LECTURE_ATTENDANCE_SUCCESS, lecture))
  } catch (error) {
    dispatch(getLectureAttendanceFailure(error.message))
  }
}

// //////////////////////////////////

export const CHANGE_STUDENT_ATTENDANCE_BEGIN = 'CHANGE_STUDENT_ATTENDANCE_BEGIN'
export const CHANGE_STUDENT_ATTENDANCE_SUCCESS = 'CHANGE_STUDENT_ATTENDANCE_SUCCESS'
export const CHANGE_STUDENT_ATTENDANCE_FAILURE = 'CHANGE_STUDENT_ATTENDANCE_FAILURE'

export const changeStudentAttendanceBegin = () => ({
  type: CHANGE_STUDENT_ATTENDANCE_BEGIN,
})

export const changeStudentAttendanceSuccess = msg => ({
  type: CHANGE_STUDENT_ATTENDANCE_SUCCESS,
  payload: msg,
})

export const changeStudentAttendanceFailure = error => ({
  type: CHANGE_STUDENT_ATTENDANCE_FAILURE,
  payload: error,
})

export const changeStudentAttendance = (lectureId, studentId, attendance) => async dispatch => {
  dispatch(changeStudentAttendanceBegin())
  try {
    const msg = await postStudentAttendance(lectureId, studentId, attendance)
    dispatch(changeStudentAttendanceSuccess(msg))
  } catch (error) {
    dispatch(changeStudentAttendanceFailure(error.message))
  }
}

// //////////////////////////////////

export const CHANGE_LECTURE_ATTENDANCE_SUCCESS = 'CHANGE_LECTURE_ATTENDANCE_SUCCESS'
export const CHANGE_LECTURE_ATTENDANCE_FAILURE = 'CLOSE_LECTURE_ATTENDANCE_FAILURE'

const dispatcher = (type, payload) => ({
  type,
  payload,
})

export const changeLectureAttendance = (lectureId, status) => async dispatch => {
  try {
    const msg = await apiChangeStatus(lectureId, status)
    dispatch(dispatcher(CHANGE_LECTURE_ATTENDANCE_SUCCESS, status))
  } catch (error) {
    dispatch(dispatcher(CHANGE_LECTURE_ATTENDANCE_FAILURE, error.message))
  }
}

export const SUBMIT_ATTENDANCE_SUCCESS = 'SUBMIT_ATTENDANCE_SUCCESS'
export const SUBMIT_ATTENDANCE_FAILURE = 'SUBMIT_ATTENDANCE_FAILURE'

export const submitAttendance = lectureId => async dispatch => {
  try {
    const msg = await apiSubmitAttendance(lectureId)
    dispatch(dispatcher(SUBMIT_ATTENDANCE_SUCCESS, msg))
  } catch (error) {
    dispatch(dispatcher(SUBMIT_ATTENDANCE_FAILURE, error.message))
  }
}
