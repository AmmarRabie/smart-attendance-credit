import { fetchLectureAttendance, postStudentAttendance } from '../../DataProviders'
import {
    changeLectureAttendanceStatus as apiChangeStatus,
    submitAttendance as apiSubmitAttendance,
} from './provider'

export const GET_LECTURE_ATTENDANCE_BEGIN = 'GET_LECTURE_ATTENDANCE_BEGIN'
export const GET_LECTURE_ATTENDANCE_SUCCESS = 'GET_LECTURE_ATTENDANCE_SUCCESS'
export const GET_LECTURE_ATTENDANCE_FAILURE = 'GET_LECTURE_ATTENDANCE_FAILURE'


export const getLectureAttendanceBegin = () => ({
    type: GET_LECTURE_ATTENDANCE_BEGIN
});

export const getLectureAttendanceSuccess = (attendanceList) => ({
    type: GET_LECTURE_ATTENDANCE_SUCCESS, payload: attendanceList
});

export const getLectureAttendanceFailure = (error) => ({
    type: GET_LECTURE_ATTENDANCE_FAILURE, payload: error
});




export const GetLectureAttendance = (lecture_id) => async dispatch => {
    dispatch(getLectureAttendanceBegin())
    try {
        const lecture = await fetchLectureAttendance(lecture_id);
        dispatch(dispatcher(GET_LECTURE_ATTENDANCE_SUCCESS, lecture))

    } catch (error) {
        dispatch(getLectureAttendanceFailure(error))
    }
}

////////////////////////////////////

export const CHANGE_STUDENT_ATTENDANCE_BEGIN = 'CHANGE_STUDENT_ATTENDANCE_BEGIN'
export const CHANGE_STUDENT_ATTENDANCE_SUCCESS = 'CHANGE_STUDENT_ATTENDANCE_SUCCESS'
export const CHANGE_STUDENT_ATTENDANCE_FAILURE = 'CHANGE_STUDENT_ATTENDANCE_FAILURE'


export const changeStudentAttendanceBegin = () => ({
    type: CHANGE_STUDENT_ATTENDANCE_BEGIN,
});

export const changeStudentAttendanceSuccess = (msg) => ({
    type: CHANGE_STUDENT_ATTENDANCE_SUCCESS, payload: msg
});

export const changeStudentAttendanceFailure = (error) => ({
    type: CHANGE_STUDENT_ATTENDANCE_FAILURE, payload: error
});


export const changeStudentAttendance = (lecture_id, student_id, attendance) => async dispatch => {
    dispatch(changeStudentAttendanceBegin())
    try {
        const msg = await postStudentAttendance(lecture_id, student_id, attendance);
        dispatch(changeStudentAttendanceSuccess(msg))

    } catch (error) {
        dispatch(changeStudentAttendanceFailure(error))
    }
}

////////////////////////////////////

export const CHANGE_LECTURE_ATTENDANCE_SUCCESS = 'CHANGE_LECTURE_ATTENDANCE_SUCCESS'
export const CHANGE_LECTURE_ATTENDANCE_FAILURE = 'CLOSE_LECTURE_ATTENDANCE_FAILURE'

const dispatcher = (type, payload) => ({
    type: type, payload: payload
});


export const changeLectureAttendance = (lecture_id, status) => async dispatch => {
    try {
        const msg = await apiChangeStatus(lecture_id, status);
        dispatch(dispatcher(CHANGE_LECTURE_ATTENDANCE_SUCCESS, status))
    } catch (error) {
        dispatch(dispatcher(CHANGE_LECTURE_ATTENDANCE_FAILURE, error))
    }
}

export const SUBMIT_ATTENDANCE_SUCCESS = 'SUBMIT_ATTENDANCE_SUCCESS'
export const SUBMIT_ATTENDANCE_FAILURE = 'SUBMIT_ATTENDANCE_FAILURE'

export const submitAttendance = (lecture_id) => async dispatch => {
    try {
        const msg = await apiSubmitAttendance(lecture_id);
        dispatch(dispatcher(SUBMIT_ATTENDANCE_SUCCESS, msg))
    } catch (error) {
        dispatch(dispatcher(SUBMIT_ATTENDANCE_FAILURE, error))
    }
}