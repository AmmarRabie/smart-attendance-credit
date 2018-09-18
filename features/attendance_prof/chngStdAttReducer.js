import {
    CHANGE_STUDENT_ATTENDANCE_BEGIN,
    CHANGE_STUDENT_ATTENDANCE_SUCCESS,
    CHANGE_STUDENT_ATTENDANCE_FAILURE,
} from './actions';

const chngStudentAttendanceInitialState = {
    msg:null,
    loading: false,
    error: null
};

const chngStudentAttendanceReducer = (state = chngStudentAttendanceInitialState, action) => {
    switch (action.type) {
        case CHANGE_STUDENT_ATTENDANCE_BEGIN:
            return {
                ...state,
                loading: true,
                error: null,
                msg:null
            };
        case CHANGE_STUDENT_ATTENDANCE_SUCCESS:
            return {
                ...state,
                loading: false,
                msg: action.payload,
                error:null
            };
        case CHANGE_STUDENT_ATTENDANCE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                msg: null
            };
        default:
            // ALWAYS have a default case in a reducer
            return state;
    }
}

export default chngStudentAttendanceReducer