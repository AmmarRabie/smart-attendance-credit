import CONFIG from '../../config.json'
import {getStoreToken as getUserToken} from '../../store'

export const attendStudent = async lectureId => {
  const url = `http://${CONFIG.server_ip}/attendance/0/${lectureId}/1`
  console.log(url)
  const response = await fetch(url, {
    method: 'POST',
    headers: {'x-access-token': getUserToken()},
  })
  if (response.status === 200) {
    return
  }

  const {err} = await response.json()
  console.log(err)
  throw new Error(err)
}

export const fetchLectureInfo = async lectureId => {
  const url = `http:/${CONFIG.server_ip}/lecture/${lectureId}/status`
  console.log(url)
  const response = await fetch(url, {
    method: 'GET',
    headers: {'x-access-token': getUserToken()},
  })
  if (response.status === 200) {
    const {status} = await response.json()
    return status
  }
  const {err} = response.json()
  console.log(err)
  throw err
}

export const getStdAttendanceStatus = async lectureId => {
  const url = `http:/${CONFIG.server_ip}/std/${lectureId}/status`
  console.log(url)
  const response = await fetch(url, {
    method: 'GET',
    headers: {'x-access-token': getUserToken()},
  })
  if (response.status === 200) {
    const {status} = await response.json()
    return status
  }
  const {err} = response.json()
  console.log(err)
  throw err
}
