import {SET_GROUP_PREFERENCE} from '../../constants/actionTypes'
export default function (state = null, {type, groupPreference}) {
    switch (type) {
        case SET_GROUP_PREFERENCE:
            return groupPreference
        default:
            return state
    }
}