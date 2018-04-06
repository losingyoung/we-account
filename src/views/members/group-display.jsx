import React from 'react'
import Styled from 'styled-components'
import { NavBar, Icon } from 'antd-mobile'

class GroupDisplay extends React.Component {
    goBack = () => {
        this.props.history.goBack()
    }
  render() {
      const {groupInfo, members, title} = this.props
      return (
          <div>
                <NavBar icon={<Icon type="left" />} onLeftClick={this.goBack}>
                    <span>{title}</span>
                </NavBar>
          </div>
      )
  }
}

export default GroupDisplay