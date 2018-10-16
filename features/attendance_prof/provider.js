import CONFIG from '../../config.json'
import {getStoreToken as getUserToken} from '../../store'

export const changeLectureAttendanceStatus = async (lectureId, status) => {
  const url = `http://${CONFIG.server_ip}/changeStatus/${lectureId}/${Number(status)}`
  console.log(url)
  const response = await fetch(url, {
    method: 'POST',
    headers: {'x-access-token': getUserToken()},
  })

  if (response.status === 200) {
    const {mes} = await response.json()
    console.log(mes)
    return mes
  }
  const {err} = response.json()
  throw new Error(err)
}

export const submitAttendance = async lectureId => {
  const url = `http://${CONFIG.server_ip}/submit/${lectureId}`
  console.log(url)
  const response = await fetch(url, {
    method: 'POST',
    headers: {'x-access-token': getUserToken()},
  })

  if (response.status === 200) {
    const {msg} = await response.json()
    console.log(msg)
    return msg
  }
  const {err} = response.json()
  throw new Error(err)
}

export const changeSecret = async (lectureId, newSecret) => {
  const url = `http://${CONFIG.server_ip}/change_secret/${lectureId}`
  console.log(url, `header secret is: ${newSecret}`)
  const response = await fetch(url, {
    method: 'POST',
    headers: {'x-access-token': getUserToken(), secret: newSecret},
  })

  if (response.status === 200) {
    const {msg} = await response.json()
    console.log(msg)
    return msg
  }
  const {err} = response.json()
  throw new Error(err)
}

export const getLectureSecret = async lectureId => {
  const url = `http://${CONFIG.server_ip}/lecture_secret/${lectureId}`
  console.log(url)
  const response = await fetch(url, {
    method: 'GET',
    headers: {'x-access-token': getUserToken()},
  })

  if (response.status === 200) {
    const {secret} = await response.json()
    console.log(secret)
    return secret
  }
  const {err} = response.json()
  throw new Error(err)
}
