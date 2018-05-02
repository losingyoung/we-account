import personalAccountItems from "./personalAccountItems";
import groupAccountItems from "./groupAccountItems";
import { SET_ACCOUNT_ITEMS, ADD_PERSONAL_ACCOUNT_ITEMS, DEL_PERSONAL_ACCOUNT_ITEMS, ADD_GROUP_ACCOUNT_ITEMS, DEL_GROUP_ACCOUNT_ITEMS } from "../../../constants/actionTypes";
export default function(state = null, {type, accountItems}) {
    switch (type) {
        case SET_ACCOUNT_ITEMS:
            return accountItems // {personalAccountItems, groupAccountItems}
        case ADD_PERSONAL_ACCOUNT_ITEMS:
        case DEL_PERSONAL_ACCOUNT_ITEMS:
            return Object.assign({}, state, {
                personalAccountItems: personalAccountItems(state.personalAccountItems, {type, personalAccountItems: accountItems})
            })
        case ADD_GROUP_ACCOUNT_ITEMS:
        case DEL_GROUP_ACCOUNT_ITEMS:
            return Object.assign({}, state, {
                groupAccountItems: groupAccountItems(state.groupAccountItems, {type, groupAccountItems: accountItems})
            })
        default:
            return state;
    }
  }
