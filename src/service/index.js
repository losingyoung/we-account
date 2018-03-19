import axios from 'axios'

export const signUp = params => axios.post('/api/user/signup', params)

export const getUserInfo = params => axios.post('/api/user/get_user_info', params)





export const koaService = {
    query(params) {
        return axios.post('/api/table/query', params)
    },
    add (params){
    return axios.post('/api/table/add', params)
    },
    update (params) {
    return axios.post('/api/table/update', params)
    },
    delete(params) {
    return axios.post('/api/table/delete', params)
    }
}
export const expressService = {
    query(params) {
        return axios.post('/express/table/query', params)
    },
    add (params){
    return axios.post('/express/table/add', params)
    },
    update (params) {
    return axios.post('/express/table/update', params)
    },
    delete(params) {
    return axios.post('/express/table/delete', params)
    }
}