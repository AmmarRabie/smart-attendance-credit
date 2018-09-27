import { FETCH_BEGIN } from './actions'
import { FETCH_SUCCESS } from './actions'
import { FETCH_REJECTED } from './actions'

const lecturesReducer = (state = {}, action) => {
    switch (action.type) {
        case FETCH_SUCCESS:
            return { ...state, list: action.payload, loading: false }
        case FETCH_REJECTED:
            return { ...state, error: action.payload, loading: false }
        case FETCH_BEGIN:
            return {...state, loading: true}
        default:
            return state
    }
}

export default lecturesReducer