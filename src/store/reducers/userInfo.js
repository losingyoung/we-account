import {SET_USER_INFO, UPDATE_USER_INFO} from '../../constants/actionTypes'
export default function (state = null, {type, userInfo}) {
    switch (type) {
        case SET_USER_INFO:
            return userInfo
        case UPDATE_USER_INFO:
            return Object.assign({}, state, userInfo)
        default:
            return state
    }
}