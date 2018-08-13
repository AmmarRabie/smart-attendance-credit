
import {
    GET_WANTED_SCHEDULES_BEGIN,
    GET_WANTED_SCHEDULES_FAILURE,
    GET_WANTED_SCHEDULES_SUCCESS
} from './actinos';


const getWantedSchedulesInitialState = {
    schedules: [],
    loading: false,
    error: null
};


export const SchedulesReducer = (state = getWantedSchedulesInitialState, action) => {
    switch (action.type) {
        case GET_WANTED_SCHEDULES_BEGIN:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GET_WANTED_SCHEDULES_SUCCESS:
            return {
                ...state,
                loading: false,
                schedules: action.payload
            };
        case GET_WANTED_SCHEDULES_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                schedules: []
            };
        default:
            // ALWAYS have a default case in a reducer
            return state;
    }
}


export default SchedulesReducer
