import login from '../../DataProviders'

// types
export const LOG_IN_SENT = 'LOG_IN_SENT'
export const LOG_IN_FULFILLED = 'LOG_IN_FULFILLED'
export const LOG_IN_REJECTED = 'LOG_IN_REJECTED'

// creators
export const logInUser = (username, password) => async dispatch => {
  dispatch({type: LOG_IN_SENT})
  try {
    const response = await login(username, password)
    dispatch({
      type: LOG_IN_FULFILLED,
      payload: {
        token: response.token,
        role: response.role,
      },
    })
  } catch (err) {
    dispatch({type: LOG_IN_REJECTED, payload: err.message})
  }
}
