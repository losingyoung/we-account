import { ADD_PERSONAL_ACCOUNT_ITEMS, DEL_PERSONAL_ACCOUNT_ITEMS } from "../../../constants/actionTypes";

export default function(personalState = null, {type, personalAccountItems}) {
    switch (type) {
        case ADD_PERSONAL_ACCOUNT_ITEMS:
            return personalState.concat([personalAccountItems])
        case DEL_PERSONAL_ACCOUNT_ITEMS:
            return personalState
        default:
            return personalState
    }
}