import { combineReducers } from "redux";
import groupPreference from './reducers/groupPreference'
import userInfo from './reducers/userInfo'

export default combineReducers({
    groupPreference,
    userInfo
})
