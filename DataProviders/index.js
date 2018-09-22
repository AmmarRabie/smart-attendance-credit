// This file is responsible for interfacing and calling the app api
// All the data the application needs to fetch, should come from funcs in this file.
// so it called data provider
import base64 from 'base-64'
import CONFIG from "../config.json";

// simulation to run without calling api
const login_simulation = (id, password) => {
    // for now simulate the login call
    if (id === '' || password === '') return new Promise(
        (resolve, reject) => {
            return reject({ message: 'empty id or pass' })
        }
    );
    let role = 'prof'
    if (+id > 0) role = 'std'
    return new Promise(
        (resolve, reject) => { return resolve({ token: 'tooooken', role }) }
    );
}



const login = async (id, password) => {
    let headers = new Headers()
    headers.append('Authorization', 'Basic ' + base64.encode(id + ":" + password));   
    const response = await fetch(`http://${CONFIG.server_ip}/login`, {
        method: 'GET',
        headers: headers,
      })
    
      if (response.status == 200) {
        const {token, role} = await response.json()
        return {token, role}
      }
      const {err} = await response.json()
      throw new Error(err)
}

export default login


export const fetchCodes = async () => {
    let headers = new Headers()
    const response = await fetch(`http://${CONFIG.server_ip}/codes.json`, {
        method: 'GET',
        headers: headers})

    
    if (response.status == 200) {
        const {codes} = await response.json()
        //codes.unshift(" Please choose department ");
        return codes
    }
    const { error } = await response.text()
    throw new Error(error)
}

export const fetchSchedules = async (type,code) => {
    const url = `http://${CONFIG.server_ip}/courses-available.json?type=${encodeURIComponent(type)}&code=${encodeURIComponent(code)}`
    console.log(url)
    const response = await fetch(url, {
        method: 'GET',
    })

    if (response.status == 200) {

        // important ************
        // this part of the code  need to be rewritten after we get the response of the api as json 
        // also the component SchedulesList   
        // important *************
        const {courses} = await response.json()
        return courses// [TODO]: force it to be list even it is one item
    }
    const { error } = response.json()
    throw new Error(error)
}