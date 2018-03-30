import React from 'react'
import {NavBar, Icon} from 'antd-mobile'

class CreateNewGroup extends React.Component {
    goBack = () => {
        this.props.history.go(-1)
    }
    render() {
        let leftIcon = <Icon type="left" />
        return (
            <div >
              <NavBar  icon={leftIcon} onLeftClick={this.goBack}>
                 <span>新建组</span>
              </NavBar>
              头像
              人员
              预算
            </div>
        )
    }
}
export default CreateNewGroup