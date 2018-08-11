import { fetchCodes } from '../../DataProviders'


export const GET_CODES_BEGIN = 'GET_CODES_BEGIN'
export const GET_CODES_SUCCESS = 'GET_CODES_SUCCESS'
export const GET_CODES_FAILURE = 'GET_CODES_FAILURE'
export const GET_SESSIONS_TYPES = 'GET_SESSIONS_TYPES'
export const GET_WANTED_SCHEDULES = 'GET_WANTED_SCHEDULES'

export const getCodesBegin = () => ({
    type: GET_CODES_BEGIN
});

export const getCodesSuccess = (codes) => ({
    type: GET_CODES_SUCCESS, payload: { codes }
});

export const getCodesFailure = (error) => ({
    type: GET_CODES_FAILURE, payload: { error }
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



