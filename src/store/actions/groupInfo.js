import { SET_GROUP_INFO } from "../../constants/actionTypes";
export const setGroupInfo = groupInfo => {
    return {
        type: SET_GROUP_INFO,
        groupInfo
    }
}