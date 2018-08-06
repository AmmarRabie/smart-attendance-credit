// This file is responsible for interfacing and calling the app api
// All the data the application needs to fetch, should come from funcs in this file.
// so it called data provider

export const login = (id, password) => {
    // for now simulate the login call
    if (id === '' || password === '') return new Promise(
        (resolve, reject) => { return reject({ message: 'empty id or pass'}) }
    );
    let role = 'prof'
    if (+id > 0) role = 'std' 
    return new Promise(
        (resolve, reject) => { return resolve({ token: 'tooooken', role}) }
    );
}