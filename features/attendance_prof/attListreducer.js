import {
    GET_LECTURE_ATTENDANCE_BEGIN,
    GET_LECTURE_ATTENDANCE_SUCCESS,
    GET_LECTURE_ATTENDANCE_FAILURE,
    CHANGE_LECTURE_ATTENDANCE_SUCCESS,
    CHANGE_LECTURE_ATTENDANCE_FAILURE,
} from './actions';

const getLectureAttendanceInitialState = {
    lecture: [],
    loading: true,
    error: null,
    ok: false,
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
                lecture: action.payload
            };
        case GET_LECTURE_ATTENDANCE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                lecture: []
            };
        case CHANGE_LECTURE_ATTENDANCE_SUCCESS:
            return {
                ...state,
                lecture: {...state.lecture, status: action.payload},
                ok: true,
            };
        case CHANGE_LECTURE_ATTENDANCE_FAILURE:
            return {
                ...state,
                ok: false,
                change_lecture_error: action.payload
            };
        default:
            // ALWAYS have a default case in a reducer
            return state;
    }
}

export default LectureAttendanceReducer