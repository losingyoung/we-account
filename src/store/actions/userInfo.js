import {SET_USER_INFO, UPDATE_USER_INFO} from '../../constants/actionTypes'

export const setUserInfo = (userInfo) => {
    return{
        type: SET_USER_INFO,
        userInfo
    }
}

export const updateUserInfo = (userInfo) => {
    return {
        type: UPDATE_USER_INFO,
        userInfo
    }
}