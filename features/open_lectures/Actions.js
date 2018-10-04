import fetchStudentActiveLectures from './provider'

// Actions
export const GET_OPEN_LECTURES_SENT = 'GET_OPEN_LECTURES_SENT'
export const GET_OPEN_LECTURES_SUCCESS = 'GET_OPEN_LECTURES_SUCCESS'
export const GET_OPEN_LECTURES_FAILURE = 'GET_OPEN_LECTURES_FAILURE'

// Action Creators
export const getOpenLecturesSent = () => ({
  type: GET_OPEN_LECTURES_SENT,
})

export const GetOpenLecturesSuccess = Lectures => ({
  type: GET_OPEN_LECTURES_SUCCESS,
  payload: Lectures,
})

export const GetOpenLecturesFailure = error => ({
  type: GET_OPEN_LECTURES_FAILURE,
  payload: error,
})

export const GetOpenLectures = () => async dispatch => {
  dispatch(getOpenLecturesSent())
  try {
    const Lectures = await fetchStudentActiveLectures()
    dispatch(GetOpenLecturesSuccess(Lectures))
  } catch (error) {
    print(`there is an error here GetOpenLectures Action ${error.message}`)
    dispatch(GetOpenLecturesFailure(error.message))
  }
}
