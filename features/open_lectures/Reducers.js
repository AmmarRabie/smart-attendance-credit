import {
  GET_OPEN_LECTURES_SENT,
  GET_OPEN_LECTURES_SUCCESS,
  GET_OPEN_LECTURES_FAILURE,
} from './Actions'

const openLecturesInitialState = {
  Lectures: [],
  loading: true,
  error: null,
}

const getOPenLecturesReducer = (state = openLecturesInitialState, action) => {
  switch (action.type) {
    case GET_OPEN_LECTURES_SENT:
      return {
        ...state,
        loading: true,
        error: null,
      }
    case GET_OPEN_LECTURES_SUCCESS:
      return {
        ...state,
        loading: false,
        Lectures: action.payload,
        error: null,
      }
    case GET_OPEN_LECTURES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      }
    default:
      return state
  }
}
export default getOPenLecturesReducer
