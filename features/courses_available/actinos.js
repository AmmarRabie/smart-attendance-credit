import { fetchCodes,fetchSchedules } from '../../DataProviders'


export const GET_CODES_BEGIN = 'GET_CODES_BEGIN'
export const GET_CODES_SUCCESS = 'GET_CODES_SUCCESS'
export const GET_CODES_FAILURE = 'GET_CODES_FAILURE'
export const GET_WANTED_SCHEDULES_BEGIN   = 'GET_WANTED_SCHEDULES_BEGIN'
export const GET_WANTED_SCHEDULES_SUCCESS = 'GET_WANTED_SCHEDULES_SUCCESS'
export const GET_WANTED_SCHEDULES_FAILURE = 'GET_WANTED_SCHEDULES_FAILURE'



export const getCodesBegin = () => ({
    type: GET_CODES_BEGIN
});

export const getCodesSuccess = (codes) => ({
    type: GET_CODES_SUCCESS, payload:  codes 
});

export const getCodesFailure = (error) => ({
    type: GET_CODES_FAILURE, payload:  error 
});

export const GetWantedSchedulesBegin=()=>({
    type: GET_WANTED_SCHEDULES_BEGIN

})

export const GetWantedSchedulesSuccess = (schedules) => ({
    type: GET_WANTED_SCHEDULES_SUCCESS , payload:schedules
})
export const GetWantedSchedulesFailure = (error) => ({
    type: GET_WANTED_SCHEDULES_FAILURE, payload: error
})



export const GetCodes = () => async dispatch => {
    dispatch(getCodesBegin())
    try {
        const codes = await fetchCodes();
        dispatch(getCodesSuccess(codes))

    } catch (error) {
        dispatch(getCodesFailure(error))
    }
}


export const GetWantedSchedules = (type,code) => async dispatch => {
    dispatch(GetWantedSchedulesBegin())
    try {
        const schedules = await fetchSchedules(type,code);
        dispatch(GetWantedSchedulesSuccess(schedules))

    } catch (error) {
        dispatch(GetWantedSchedulesFailure(error))
    }
}



