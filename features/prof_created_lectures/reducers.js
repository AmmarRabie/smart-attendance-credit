import {FETCH_BEGIN, FETCH_SUCCESS, FETCH_REJECTED} from './actions'

const lecturesReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {...state, list: action.payload, loading: false}
    case FETCH_REJECTED:
      return {...state, error: action.payload, loading: false}
    case FETCH_BEGIN:
      return {...state, loading: true}
    default:
      return state
  }
}

export default lecturesReducer
