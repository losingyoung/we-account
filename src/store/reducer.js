import { combineReducers } from "redux";
import groupPreference from './reducers/groupPreference'
import userInfo from './reducers/userInfo'
import groupInfo from './reducers/groupInfo'

export default combineReducers({
    groupPreference,
    userInfo,
    groupInfo
})
