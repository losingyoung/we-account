import { ADD_GROUP_ACCOUNT_ITEMS, DEL_GROUP_ACCOUNT_ITEMS } from "../../../constants/actionTypes";

export default function(groupState = null, {type, groupAccountItems}) {
    switch (type) {
        case ADD_GROUP_ACCOUNT_ITEMS:
            return groupState.concat([groupAccountItems])
        case DEL_GROUP_ACCOUNT_ITEMS:
            return groupState
        default:
            return groupState
    }
}

