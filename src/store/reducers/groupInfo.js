import { SET_GROUP_INFO } from "../../constants/actionTypes";
export default function(state = null, {type, groupInfo}) {
    switch (type) {
        case SET_GROUP_INFO:
            return groupInfo
        default:
            return state
    }
}