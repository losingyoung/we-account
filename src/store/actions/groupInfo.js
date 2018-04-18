import { SET_GROUP_INFO, CREATE_NEW_GROUP, EDIT_GROUP } from "../../constants/actionTypes";
export const setGroupInfo = groupInfo => {
    return {
        type: SET_GROUP_INFO,
        groupInfo
    }
}

export const createGroup = groupInfo => {
    return {
        type: CREATE_NEW_GROUP,
        groupInfo
    }
}

export const editGroup = groupInfo => {
    return {
        type: EDIT_GROUP,
        groupInfo
    }
}