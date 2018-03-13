import axios from 'axios'

export const signUp = params => axios.post('/user/signup', params)
