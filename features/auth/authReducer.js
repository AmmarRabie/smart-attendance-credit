import {LOG_IN_FULFILLED} from './authActions'
import {LOG_IN_REJECTED} from './authActions'


const merge = (prev, next) => Object.assign({}, prev, next)

const authReducer = (state = {}, action) => {
    switch (action.type) {
      case LOG_IN_FULFILLED:
        return merge(state, {userData: action.payload})
      case LOG_IN_REJECTED:
        return merge(state, {loginErr: action.payload})
      default:
        return state
    }
}

export default authReducer