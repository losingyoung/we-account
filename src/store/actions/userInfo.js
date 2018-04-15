import {SET_USER_INFO} from '../../constants/actionTypes'

export const setUserInfo = (userInfo) => {
    return{
        type: SET_USER_INFO,
        userInfo
    }
}