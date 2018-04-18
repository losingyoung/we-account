import { SET_GROUP_INFO, CREATE_NEW_GROUP, EDIT_GROUP } from "../../constants/actionTypes";
export default function(state = null, {type, groupInfo}) {
    
    switch (type) {
        case SET_GROUP_INFO:
            return groupInfo
        case CREATE_NEW_GROUP:
            return state.concat(groupInfo)
        case EDIT_GROUP:
            return state.map(group => {
                return group.group_id === groupInfo.group_id ? Object.assign({}, group, groupInfo) : group
            })
        default:
            return state
    }
}