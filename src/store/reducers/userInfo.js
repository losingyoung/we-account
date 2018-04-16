import {SET_USER_INFO} from '../../constants/actionTypes'
export default function (state = null, {type, userInfo}) {
    switch (type) {
        case SET_USER_INFO:
            return userInfo
        default:
            return state
    }
}