import axios from 'axios'
/*user*/
export const signUp = params => axios.post('/api/user/signup', params)

export const getUserInfo = params => axios.post('/api/user/get_user_info', params)


/* Group */
export const getGroups = params => axios.post('/api/group/get_groups_by_wa_code', params)



/* category icons*/

export const getPersonalIcons = params => axios.post('/api/cate_icon/get_personal_icons', params)
export const getGroupIcons = params => axios.post('/api/cate_icon/get_group_icons', params)
export const getDefaultIcons = params => axios.post('/api/cate_icon/get_default_icons', params)
export const addCate = params => axios.post('/api/cate_icon/add_icon', params)
export const updateCate = params => axios.post('/api/cate_icon/update_icon', params)
export const deleteCate = params => axios.post('/api/cate_icon/delete_icon', params)

/* 完成添加 */
export const addAccountItem = params => axios.post('/api/account/add_item', params)


export const getNotifications = params => axios.post('/api/notification/get_notifications', params)
export const getUnreadNotifications = params => axios.post('/api/notification/get_unread_notifications', params)

export const refuseRequest = params => axios.post('/api/notification/refuse_request', params)
export const acceptRequest = params => axios.post('/api/notification/accept_request', params)
export const koaService = {
    query(params) {
        return axios.post('/api/table/query', params)
    },
    add (params){
    return axios.post('/api/table/add', params)
    },
    update (params) {
    return axios.post('/api/table/update', params)
    },
    delete(params) {
    return axios.post('/api/table/delete', params)
    }
}
export const expressService = {
    query(params) {
        return axios.post('/express/table/query', params)
    },
    add (params){
    return axios.post('/express/table/add', params)
    },
    update (params) {
    return axios.post('/express/table/update', params)
    },
    delete(params) {
    return axios.post('/express/table/delete', params)
    }
}