import {attendStudent,fetchLectureInfo} from './provider'

//Actions

export const ATTEND_STUDENT_SENT='ATTEND_STUDENT_SENT'
export const ATTEND_STUDENT_SUCCESS='ATTEND_STUDENT_SUCCESS'
export const ATTEND_STUDENT_FAILURE='ATTEND_STUDENT_FAILURE'

export const CHECK_ATTENDANCE_STATUS_SENT='CHECK_ATTENDANCE_STATUS_SENT'
export const CHECK_ATTENDANCE_STATUS_SUCCESS='CHECK_ATTENDANCE_SUCCESS'
export const CHECK_ATTENDANCE_STATUS_FAILURE='CHECK_ATTENDANCE_FAILURE'

//Action Creators

export const attendStudentSent=()=>({
    type:ATTEND_STUDENT_SENT
})

export const attendStudentSuccess=()=>({
    type:ATTEND_STUDENT_SUCCESS
})
export const attendStudentFailure=(err)=>({
    type:ATTEND_STUDENT_FAILURE,
    payload:err
})
export const makeStudentAttend=(LectureId)=> async dispatch=>{
    dispatch(attendStudentSent())
    try{
        await attendStudent(LectureId)
        dispatch(attendStudentSuccess())
    }
    catch(error){
        console.log(`erorr in make student attend: ${error}`)
        dispatch(attendStudentFailure(error))
    }
}

export const checkAttendanceStatusSent=()=>({
    type:CHECK_ATTENDANCE_STATUS_SENT
})

export const checkAttendanceStatusSuccess=(LectureStatus)=>({
    type:CHECK_ATTENDANCE_STATUS_SUCCESS,
    payload:LectureStatus

})

export const checkAttendanceStatusFailure=(error)=>({
    type:CHECK_ATTENDANCE_STATUS_FAILURE,
    payload:error
})
export const checkAttendanceStatus=(LectureId)=> async dispatch=>{
    dispatch(checkAttendanceStatusSent())
    try{
        LectureStatus = await fetchLectureInfo(LectureId)
        dispatch(checkAttendanceStatusSuccess(LectureStatus))
    }
    catch(error){
        dispatch(checkAttendanceStatusFailure(error))

    }
}