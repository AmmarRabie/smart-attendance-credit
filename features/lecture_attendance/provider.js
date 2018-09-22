import CONFIG from '../../config.json'

export const attendStudent = async (studentId, lectureId) => {
    const url = `http://${CONFIG.server_ip}/attendance/${studentId}/${lectureId}/1`
    const response = await fetch(url, {
        method: 'POST'
    })
    if (response.status == 200) {
        return
    }
    const { err } = response.json()
    throw new Error(err)
}

export const fetchLectureInfo = async (lectureId) => {
    const url = `http:/${CONFIG.server_ip}/lecture.json/${lectureId}`
    const response = await fetch(url, {
        method: 'GET'
    })
    if (response.status == 200) {
        const { lecture } = await response.json()
        return lecture.status
    }
    const { err } = response.json()
    throw new Error(err)
}