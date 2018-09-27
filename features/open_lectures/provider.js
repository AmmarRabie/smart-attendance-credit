import CONFIG from '../../config.json'

export const fetchStudentActiveLectures= async (studentId)=>{
    const url=`http://${CONFIG.server_ip}/${studentId}/lectures.json`
    console.log(url)
    const response=await fetch(url,{
        method:'GET'
    })
    if(response.status==200){
        console.log('status 200')
        const {lectures}=await response.json()
    
        return lectures
        
    }
    const {err}=response.json()
    console.log(err)
    throw new Error (err)
}