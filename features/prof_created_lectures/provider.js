import CONFIG from "../../config.json";
import { getStoreToken as getUserToken} from '../../store';

export const fetchLectures = async () => {
    const url = `http://${CONFIG.server_ip}/prof/lectures.json`
    console.log(url)
    const response = await fetch(url, {
        method: 'GET',
        headers: { 'x-access-token': getUserToken() }
    })

    if (response.status == 200) {
        const { lectures } = await response.json()
        console.log(lectures)
        return lectures// [TODO]: force it to be list even it is one item
    }
    const { error } = response.json()
    throw new Error(error)
}

export default fetchLectures