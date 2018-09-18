import { fetchLectureAttendance } from '../../DataProviders'

export const GET_LECTURE_ATTENDANCE_BEGIN       = 'GET_LECTURE_ATTENDANCE_BEGIN'
export const GET_LECTURE_ATTENDANCE_SUCCESS     = 'GET_LECTURE_ATTENDANCE_SUCCESS'
export const GET_LECTURE_ATTENDANCE_FAILURE     = 'GET_LECTURE_ATTENDANCE_FAILURE'


export const getLectureAttendanceBegin = (lecId) => ({
    type: GET_LECTURE_ATTENDANCE_BEGIN ,payload:lecId
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