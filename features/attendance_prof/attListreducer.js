import {
    GET_LECTURE_ATTENDANCE_BEGIN,
    GET_LECTURE_ATTENDANCE_SUCCESS,
    GET_LECTURE_ATTENDANCE_FAILURE,
} from './actions';

const getLectureAttendanceInitialState = {
    attendanceList: [],
    loading: true,
    error: null
};


const LectureAttendanceReducer = (state = getLectureAttendanceInitialState, action) => {
    switch (action.type) {
        case GET_LECTURE_ATTENDANCE_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_LECTURE_ATTENDANCE_SUCCESS:
            return {
                ...state,
                loading: false,
                attendanceList: action.payload
            };
        case GET_LECTURE_ATTENDANCE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                attendanceList: []
            };
        default:
            // ALWAYS have a default case in a reducer
            return state;
    }
}

export default LectureAttendanceReducer



