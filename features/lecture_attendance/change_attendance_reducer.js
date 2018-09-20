import{
    ATTEND_STUDENT_SENT,
    ATTEND_STUDENT_SUCCESS,
    ATTEND_STUDENT_FAILURE,
}from'./attendance_studentActions'

const studentAttendanceInitialState={
    studnetIsAttend:false,
    studentAttendError:null,
    studentAttendLoading:true
}
const merge = (prev, next) => Object.assign({}, prev, next)
const changeStudentAttendanceReducer=(state=studentAttendanceInitialState,action)=> {
    switch(action.type){
        case ATTEND_STUDENT_SENT:
        return{
            ...state,
            studentAttendLoading:true,
        }
        case ATTEND_STUDENT_SUCCESS:
        return{
            ...state,
            studentAttendLoading:false,
            isAttend:true
        }
        case ATTEND_STUDENT_FAILURE:
        return{
            ...state,
            studentAttendLoading:false,
            studentAttendError:action.payload
        }
        default:
            return state

    }
}
export default changeStudentAttendanceReducer