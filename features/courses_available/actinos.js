// *********  All Action of CoursesScreen (get codes of the courses and get specific schedules)

import { fetchCodes, fetchSchedules, openlecture } from '../../DataProviders'




export const GET_CODES_BEGIN = 'GET_CODES_BEGIN'
export const GET_CODES_SUCCESS = 'GET_CODES_SUCCESS'
export const GET_CODES_FAILURE = 'GET_CODES_FAILURE'

export const GET_WANTED_SCHEDULES_BEGIN   = 'GET_WANTED_SCHEDULES_BEGIN'
export const GET_WANTED_SCHEDULES_SUCCESS = 'GET_WANTED_SCHEDULES_SUCCESS'
export const GET_WANTED_SCHEDULES_FAILURE = 'GET_WANTED_SCHEDULES_FAILURE'

export const OPEN_NEW_LECTURE_BEGIN     = 'OPEN_NEW_LECTURE_BEGIN'
export const OPEN_NEW_LECTURE_SUCCESS   = 'OPEN_NEW_LECTURE_SUCCESS'
export const OPEN_NEW_LECTURE_FAILURE   = 'OPEN_NEW_LECTURE_FAILURE'

//////////////// get codes of departments of the university


export const getCodesBegin = () => ({
    type: GET_CODES_BEGIN
});

export const getCodesSuccess = (codes) => ({
    type: GET_CODES_SUCCESS, payload:  codes 
});

export const getCodesFailure = (error) => ({
    type: GET_CODES_FAILURE, payload:  error 
});


export const GetCodes = () => async dispatch => {
    dispatch(getCodesBegin())
    try {
        const codes = await fetchCodes();
        dispatch(getCodesSuccess(codes))

    } catch (error) {
        dispatch(getCodesFailure(error))
    }
}

/////////////////////////////////////////////////////////////////////////////////////////

//// get specific Schedules  ( by schedule type & Schedule couse code ) 

export const GetWantedSchedulesBegin=()=>({
    type: GET_WANTED_SCHEDULES_BEGIN

})

export const GetWantedSchedulesSuccess = (schedules) => ({
    type: GET_WANTED_SCHEDULES_SUCCESS , payload:schedules
})
export const GetWantedSchedulesFailure = (error) => ({
    type: GET_WANTED_SCHEDULES_FAILURE, payload: error
})

export const GetWantedSchedules = (type,code) => async dispatch => {
    dispatch(GetWantedSchedulesBegin())
    try {
        const schedules = await fetchSchedules(type,code);
        dispatch(GetWantedSchedulesSuccess(schedules))

    } catch (error) {
        dispatch(GetWantedSchedulesFailure(error))
    }
}

///////////////////////////////////////////////////////////////////////////////////////////


//////////////// open new lecture


export const openNewLectureBegin = () => ({
    type: OPEN_NEW_LECTURE_BEGIN
});

export const openNewLectureSuccess = (lectureId) => ({
    type: OPEN_NEW_LECTURE_SUCCESS, payload: lectureId
});

export const openNewLectureFailure = (error) => ({
    type: OPEN_NEW_LECTURE_FAILURE, payload: error
});


export const openNewLecture = (scheduleId) => async dispatch => {
    dispatch(openNewLectureBegin())
    try {
        const LectureId = await openlecture(scheduleId);
        dispatch(openNewLectureSuccess(LectureId))

    } catch (error) {
        dispatch(openNewLectureFailure(error))
    }
}