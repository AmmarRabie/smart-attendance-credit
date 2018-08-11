import {
    GET_CODES_BEGIN,
    GET_CODES_SUCCESS,
    GET_CODES_FAILURE
} from './actinos';


const getCodesInitialState = {
    codes: [],
    loading: true,
    error: null
};

const merge = (prev, next) => Object.assign({}, prev, next)

const codesReducer = (state = getCodesInitialState, action) => {
    switch (action.type) {
        case GET_CODES_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_CODES_SUCCESS:
            return {
                ...state,
                loading: false,
                codes: action.payload.codes
            };
        case GET_CODES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                codes: []
            };
        default:
            // ALWAYS have a default case in a reducer
            return state;
    }
}

export default codesReducer