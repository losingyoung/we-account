import {SET_GROUP_PREFERENCE} from '../../constants/actionTypes'

export const setGroupPreference = (groupPreference) => {
    return{
        type: SET_GROUP_PREFERENCE,
        groupPreference
    }
}