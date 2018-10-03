import { LOG_IN_FULFILLED, LOG_IN_REJECTED, LOG_IN_SENT } from './authActions'


const merge = (prev, next) => Object.assign({}, prev, next)

authInitialState = {
  loading: false,
  loginErr: null
}

const authReducer = (state = authInitialState, action) => {
  switch (action.type) {
    case LOG_IN_SENT:
      return {
        ...state,
        loading: true,
        loginErr: null,
      }
    case LOG_IN_FULFILLED:
      return {
        ...state,
        userData: action.payload,
        loading: false,
      }
    case LOG_IN_REJECTED:
      return {
        ...state,
        loginErr: action.payload,
        loading: false,
      }
    default:
      return state
  }
}

export default authReducer