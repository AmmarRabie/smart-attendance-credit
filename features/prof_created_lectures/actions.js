import {fetchLectures as apiFetch} from './provider'

// types
export const FETCH_BEGIN = 'FETCH_LECTURES_SENT'
export const FETCH_SUCCESS = 'FETCH_LECTURES_FULFILLED'
export const FETCH_REJECTED = 'FETCH_LECTURES_REJECTED'

// creators
export const fetchLectures = profId => async dispatch => {
  dispatch({type: FETCH_BEGIN})
  try {
    const lectures = await apiFetch(profId)
    dispatch({
      type: FETCH_SUCCESS,
      payload: lectures,
    })
  } catch (err) {
    dispatch({type: FETCH_REJECTED, payload: err.message})
  }
}
