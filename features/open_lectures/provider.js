import CONFIG from '../../config.json'

export const fetchStudentActiveLectures= async (studentId)=>{
    const url=`http://${CONFIG.server_ip}/${studentId}/lectures.json`
    const response=await fetch(url,{
        method:'GET'
    })
    if(response.status==200){
        const {lectures}=await response.json()
        return lectures
    }
    const {err}=response.json()
    throw new Error (err)
}