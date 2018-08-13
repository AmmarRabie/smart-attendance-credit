import {
    GET_CODES_BEGIN,
    GET_CODES_SUCCESS,
    GET_CODES_FAILURE,
} from './actinos';


/// for every asyncronous action there is three variable
// 1- the result of the action 
//2- flag indicates error 
//3- flag indicates the action is running or not

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
                codes: action.payload
            };
        case GET_CODES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                codes: []
            };
        default:
            // ALWAYS have a default case in a reducer
            return state;
    }
}

export default codesReducer

