import CONFIG from '../../config.json'
import { getStoreToken as getUserToken} from '../../store';

export const attendStudent = async (studentId, lectureId) => {
    const url = `http://${CONFIG.server_ip}/attendance/${studentId}/${lectureId}/1`
    console.log(url)
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'x-access-token': getUserToken() }
    })
    if (response.status === 200) {
        return
    }

    const err = response.json()
    console.log(err)
    throw new Error(err)
}

export const fetchLectureInfo = async (lectureId) => {
    const url = `http:/${CONFIG.server_ip}/lecture.json/${lectureId}`
    console.log(url)
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'x-access-token': getUserToken() }

    })
    if (response.status == 200) {
        const { lecture } = await response.json()
        console.log(`api fetch ${lecture.status}`)
        return lecture.status
    }
    const { err } = response.json()
    console.log(err)
    throw new Error(err)
}