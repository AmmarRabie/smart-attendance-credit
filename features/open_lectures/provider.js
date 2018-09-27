import CONFIG from '../../config.json'
import { getStoreToken as getUserToken} from '../../store';

export const fetchStudentActiveLectures= async ()=>{
    const url=`http://${CONFIG.server_ip}/lectures.json`
    console.log(url)
    const response=await fetch(url,{
        method:'GET',
        headers: {'x-access-token': getUserToken()}
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