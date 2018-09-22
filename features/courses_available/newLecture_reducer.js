import {
    OPEN_NEW_LECTURE_BEGIN,
    OPEN_NEW_LECTURE_SUCCESS,
    OPEN_NEW_LECTURE_FAILURE,
} from './actinos';

const openNewLectureInitialState = {
    lectureId: null,
    loading: false,
    error: null
};


const openNewLecture = (state = openNewLectureInitialState, action) => {
    switch (action.type) {
        case OPEN_NEW_LECTURE_BEGIN:
            return {
                ...state,
                loading: true,
                error: null,
                lectureId:null
            };
        case OPEN_NEW_LECTURE_SUCCESS:
            return {
                ...state,
                loading: false,
                lectureId: action.payload,
                error:null
            };
        case OPEN_NEW_LECTURE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                lectureId: null
            };
        default:
            // ALWAYS have a default case in a reducer
            return state;
    }
}

export default openNewLecture

