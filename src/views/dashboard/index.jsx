import React from 'react'
import {
    NavBar,
    Picker
} from 'antd-mobile';

function Title(props) {
    return (
        <div
            onClick={props.onClick}
            style={{
                padding: "5px 15px",
                display: "flex",
                "alignItems": "center"
            }}>
            <div style={{
                "marginRight": "5px"
            }}>{props.extra}</div>
            {props.children}
        </div>
    )
}
class DashBoard extends React.Component {
    state = {
        ownerSelectData: null,
        curForValue: null
    }
    setOwnerPickerData(val) {

    }
    getOwnerPicker(ownerSelectData) {
        if (ownerSelectData) {
            return (
                <Picker cascade={false} data={ownerSelectData} onOk={this.setOwnerPickerData}
                    onDismiss={e => { console.log('dismiss', e) }} value={[this.state.curForValue]}>
                    <Title>
                        <span className='fa fa-angle-down'></span>
                    </Title>
                </Picker>
            )
        } else {
            return (
                <Title>
                    <span>加载中...</span>
                </Title>
            )
        }
    }
    render() {
        const {ownerSelectData} = this.state
        return (
            <div>
                <NavBar mode="dark" >
                    {this.getOwnerPicker(ownerSelectData)}
                </NavBar>
                
                最近添加项目

                统计
                总支出
                距预算
                日均

                每一项支出／每天支出

            </div>
        )
    }
}
export default DashBoard