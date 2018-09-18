import { fetchLectureAttendance, postStudentAttendance } from '../../DataProviders'

export const GET_LECTURE_ATTENDANCE_BEGIN       = 'GET_LECTURE_ATTENDANCE_BEGIN'
export const GET_LECTURE_ATTENDANCE_SUCCESS     = 'GET_LECTURE_ATTENDANCE_SUCCESS'
export const GET_LECTURE_ATTENDANCE_FAILURE     = 'GET_LECTURE_ATTENDANCE_FAILURE'


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
        const codes = await fetchLectureAttendance(lecture_id);
        dispatch(getLectureAttendanceSuccess(codes))

    } catch (error) {
        dispatch(getLectureAttendanceFailure(error))
    }
}

////////////////////////////////////

export const CHANGE_STUDENT_ATTENDANCE_BEGIN   = 'CHANGE_STUDENT_ATTENDANCE_BEGIN'
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


export const changeStudentAttendance = (lecture_id, student_id, attendance)=> async dispatch => {
    dispatch(changeStudentAttendanceBegin())
    try {
        const msg = await postStudentAttendance(lecture_id,student_id,attendance);
        dispatch(changeStudentAttendanceSuccess(msg))

    } catch (error) {
        dispatch(changeStudentAttendanceFailure(error))
    }
}