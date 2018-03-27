import React from 'react'
import {NavBar, WhiteSpace} from 'antd-mobile'
import GroupItem from './group-item'

class Members extends React.Component {
    render() {
        return (
            <div>
                <NavBar mode="dark">
                  搜索框
                  添加
                </NavBar>
                <GroupItem></GroupItem>
            </div>
        )
    }
}
export default Members