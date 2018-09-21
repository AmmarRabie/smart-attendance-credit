import {
    CHANGE_LECTURE_ATTENDANCE_SUCCESS,
    CHANGE_LECTURE_ATTENDANCE_FAILURE,
} from './actions';

const defaultInitialState = {
    ok: undefined
}

const AttendanceStatusReducer = (state = defaultInitialState, action) => {
    switch (action.type) {
        case CHANGE_LECTURE_ATTENDANCE_SUCCESS:
            return {
                ...state,
                ok: true
            };
        case CHANGE_LECTURE_ATTENDANCE_FAILURE:
            return {
                ...state,
                ok: false

            };
        default:
            return state;
    }
}

export default AttendanceStatusReducer