import {
  CHANGE_SECRET_BEGIN,
  CHANGE_SECRET_SUCCESS,
  CHANGE_SECRET_FAILED,
  GET_LECTURE_SECRET_SUCCESS,
} from './actions'

const secretInitialState = {
  loading: false,
  error: null,
  value: '0000',
}

const SecretReducer = (state = secretInitialState, action) => {
  switch (action.type) {
    case CHANGE_SECRET_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case CHANGE_SECRET_SUCCESS:
      return {
        ...state,
        loading: false,
        value: action.payload,
      }
    case CHANGE_SECRET_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    case GET_LECTURE_SECRET_SUCCESS:
      console.log(`from the reducer secret is: ${action.payload}`)
      return {
        ...state,
        value: action.payload,
      }
    default:
      // ALWAYS have a default case in a reducer
      return state
  }
}

export default SecretReducer
