// This file is responsible for interfacing and calling the app api
// All the data the application needs to fetch, should come from funcs in this file.
// so it called data provider
import base64 from 'base-64'

import CONFIG from '../config.json'
import {getStoreToken as getUserToken} from '../store'

const login = async (id, password) => {
  const headers = new Headers()
  headers.append('Authorization', `Basic ${base64.encode(`${id}:${password}`)}`)
  const response = await fetch(`http://${CONFIG.server_ip}/login`, {
    method: 'GET',
    headers,
  })

  if (response.status === 200) {
    const {token, role} = await response.json()
    return {token, role}
  }
  const {err} = await response.json()
  throw new Error(err)
}

export default login

export const fetchCodes = async () => {
  const response = await fetch(`http://${CONFIG.server_ip}/codes.json`, {
    method: 'GET',
    headers: {'x-access-token': getUserToken()},
  })

  if (response.status === 200) {
    const {codes} = await response.json()
    // codes.unshift(" Please choose department ");
    return codes
  }
  const {error} = await response.text()
  throw new Error(error)
}

export const fetchSchedules = async (type, code) => {
  const url = `http://${CONFIG.server_ip}/courses-available.json?type=${encodeURIComponent(
    type
  )}&code=${encodeURIComponent(code)}`
  console.log(url)
  const response = await fetch(url, {
    method: 'GET',
    headers: {'x-access-token': getUserToken()},
  })

  if (response.status === 200) {
    // important ************
    // this part of the code  need to be rewritten after we get the response of the api as json
    // also the component SchedulesList
    // important *************
    const {courses} = await response.json()
    return courses // [TODO]: force it to be list even it is one item
  }
  const {error} = response.json()
  throw new Error(error)
}

export const fetchLectureAttendance = async lecture_id => {
  const url = `http://${CONFIG.server_ip}/lecture.json/${encodeURIComponent(lecture_id)}`
  console.log(url)
  const response = await fetch(url, {
    method: 'GET',
    headers: {'x-access-token': getUserToken()},
  })

  if (response.status === 200) {
    // important ************
    // this part of the code  need to be rewritten after we get the response of the api as json
    // also the component SchedulesList
    // important *************
    const {lecture} = await response.json()
    return lecture
  }
  const {error} = response.json()
  throw new Error(error)
}

export const postStudentAttendance = async (lecture_id, student_id, attendance) => {
  const attendance_flag = attendance ? 1 : 0 // url accept integer 0 or 1

  const url = `http://${CONFIG.server_ip}/attendance/${encodeURIComponent(
    student_id
  )}/${encodeURIComponent(lecture_id)}/${encodeURIComponent(attendance_flag)}`
  console.log(url)
  const response = await fetch(url, {
    method: 'POST',
    headers: {'x-access-token': getUserToken()},
  })

  if (response.status === 200) {
    // important ************
    // this part of the code  need to be rewritten after we get the response of the api as json
    // also the component SchedulesList
    // important *************
    const obj = await response.json()

    return obj // [TODO]: force it to be list even it is one item
  }
  const {error} = response.json()
  throw new Error(error)
}

export const openlecture = async scheduleId => {
  const url = `http://${CONFIG.server_ip}/lecture/new/${encodeURIComponent(scheduleId)}`
  const response = await fetch(url, {
    method: 'post',
    headers: {'x-access-token': getUserToken()},
  })

  if (response.status === 200) {
    // important ************
    // important *************
    const obj = await response.json()

    return obj.id // [TODO]: force it to be list even it is one item
  }
  const {error} = response.json()

  throw new Error(error)
}
