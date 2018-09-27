import{
    CHECK_ATTENDANCE_STATUS_SENT,
    CHECK_ATTENDANCE_STATUS_SUCCESS,
    CHECK_ATTENDANCE_STATUS_FAILURE
}from './actions'

const attendanceStateInitialState={
    statusIsOpen:false,
    statusError:null,
    loading:true
}
const merge = (prev, next) => Object.assign({}, prev, next)

const checkAttendanceStatusReducer=(state=attendanceStateInitialState,action)=>{
    switch(action.type){
        case CHECK_ATTENDANCE_STATUS_SENT:
        return{
            ...state,
            statusLoading:true,
            statusError:null
        }
        case CHECK_ATTENDANCE_STATUS_SUCCESS:
        return{
            ...state,
            statusLoading:false,
            statusError:null,
            attendanceStatusOpen:action.payload
        } 
        case CHECK_ATTENDANCE_STATUS_FAILURE:
        return{
            ...state,
            statusLoading:false,
            statusError:action.payload
        }
        default:
        return state
    }
}
export default checkAttendanceStatusReducer