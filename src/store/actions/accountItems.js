import { SET_ACCOUNT_ITEMS, ADD_PERSONAL_ACCOUNT_ITEMS, DEL_PERSONAL_ACCOUNT_ITEMS, ADD_GROUP_ACCOUNT_ITEMS, DEL_GROUP_ACCOUNT_ITEMS} from "../../constants/actionTypes";

export const setAccountItems = accountItems => {
    return {
        type: SET_ACCOUNT_ITEMS,
        accountItems
    }
}

export const addPersonalAccountItem = accountItems => {
    return {
        type: ADD_PERSONAL_ACCOUNT_ITEMS,
        accountItems
    }
}
export const delPersonalAccountItem = accountItems => {
    return {
        type: DEL_PERSONAL_ACCOUNT_ITEMS,
        accountItems
    }
}

export const addGroupAccountItem = accountItems => {
    return {
        type: ADD_GROUP_ACCOUNT_ITEMS,
        accountItems
    }
}

export const delGroupAccountItem = accountItems => {
    return {
        type: DEL_GROUP_ACCOUNT_ITEMS,
        accountItems
    }
}