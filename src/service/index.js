import Fetch from './fetch'
/*user*/
export const signUp = params => Fetch.post('/api/user/signup', params)
export const getUserInfo = params => Fetch.post('/api/user/get_user_info', params)
export const uploadUserAvatar = params => Fetch.post('/api/user/upload_user_avatar', params)
export const updateUserInfo = params => Fetch.post('/api/user/update_user_info', params)

/* Group */
export const getGroups = params => Fetch.post('/api/group/get_groups_by_wa_code', params)
export const createGroup = params => Fetch.post('/api/group/create_group', params)
export const editGroup = params => Fetch.post('/api/group/edit_group', params)

/* category icons*/

export const getPersonalIcons = params => Fetch.post('/api/cate_icon/get_personal_icons', params)
export const getGroupIcons = params => Fetch.post('/api/cate_icon/get_group_icons', params)
export const getDefaultIcons = params => Fetch.post('/api/cate_icon/get_default_icons', params)
export const addCate = params => Fetch.post('/api/cate_icon/add_icon', params)
export const updateCate = params => Fetch.post('/api/cate_icon/update_icon', params)
export const deleteCate = params => Fetch.post('/api/cate_icon/delete_icon', params)

/* acount items*/
export const getPersonalAccountItem = params => Fetch.post('/api/account/get_personal_account_items', params)
export const getGroupAccountItems = params => Fetch.post('/api/account/get_group_account_items', params)
export const addAccountItem = params => Fetch.post('/api/account/add_item', params)
export const getAccountItem = params => Fetch.post('/api/account/get_account_items', params)

export const getNotifications = params => Fetch.post('/api/notification/get_notifications', params)
export const getUnreadNotifications = params => Fetch.post('/api/notification/get_unread_notifications', params)

export const refuseRequest = params => Fetch.post('/api/notification/refuse_request', params)
export const acceptRequest = params => Fetch.post('/api/notification/accept_request', params)


export const uploadFile = params=> Fetch.post('/api/account/add_item', params)
export const koaService = {
    query(params) {
        return Fetch.post('/api/table/query', params)
    },
    add (params){
    return Fetch.post('/api/table/add', params)
    },
    update (params) {
    return Fetch.post('/api/table/update', params)
    },
    delete(params) {
    return Fetch.post('/api/table/delete', params)
    }
}
export const expressService = {
    query(params) {
        return Fetch.post('/express/table/query', params)
    },
    add (params){
    return Fetch.post('/express/table/add', params)
    },
    update (params) {
    return Fetch.post('/express/table/update', params)
    },
    delete(params) {
    return Fetch.post('/express/table/delete', params)
    }
}