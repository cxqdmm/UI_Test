import axios from 'axios'

var fetch = (url, type, data = {}, params = {}) => {
    return axios({
        method: type,
        url: `${url}?v=${(new Date()).getTime()}`,
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        data: JSON.stringify(data),
        params: params
    }).then(response => {
        console.log(response)
        return response.data
    })
}
export {fetch}