import CONFIG from "../../config.json";

export const changeLectureAttendanceStatus = async (lectureId, status) => {
    const url = `http://${CONFIG.server_ip}/changeStatus/${lectureId}/${Number(status)}`
    console.log(url)
    const response = await fetch(url, {
        method: 'POST',
    })

    if (response.status === 200) {
        const { mes } = await response.json()
        console.log(mes)
        return mes
    }
    const { err } = response.json()
    throw new Error(err)
}

export const submitAttendance = async (lectureId) => {
    const url = `http://${CONFIG.server_ip}/submit/${lectureId}`
    console.log(url)
    const response = await fetch(url, {
        method: 'POST',
    })

    if (response.status === 200) {
        const { msg } = await response.json()
        console.log(msg)
        return msg
    }
    const { err } = response.json()
    throw new Error(err)
}