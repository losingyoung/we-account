import { combineReducers } from "redux";
import groupPreference from './reducers/groupPreference'
import userInfo from './reducers/userInfo'
import groupInfo from './reducers/groupInfo'
import accountItems from "./reducers/accountItems/index.js";
export default combineReducers({
    groupPreference,
    userInfo,
    groupInfo,
    accountItems
})
