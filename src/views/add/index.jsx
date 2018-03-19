import React from 'react'
import { DatePicker,Picker, List, NavBar, Icon } from 'antd-mobile';
function Title(props) {
    return (
        <div
            onClick={props.onClick}
            style={{padding:"5px 15px"}}
        >{props.children}
          {/* <div style={{ display: 'flex'}}>
            <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}></div>
             <div style={{ textAlign: 'right', color: '#888', marginRight: 15 }}>{props.extra}</div>
          </div> */}
        </div>
    )
}
class Add extends React.Component {
    constructor(props) {
        super(props)
        this.goBack = this.goBack.bind(this)
        this.state = {
            curFor: {
                value: 'self',
                label: 'losingyoung'
            }
        }
    }
    goBack() {
      console.log('back')
    }
    render() {
        let leftIcon =''// <Icon type="left" />
        let district = [{
            value: 'self',
            label: 'losingyoung'
        }, {
            value: 'group',
            label: '家庭'
        }]
        return (
            <div>
                <NavBar
                    mode="light"
                    icon={leftIcon}
                    onLeftClick={this.goBack}
                    >
                    <Picker 
                        data={district}
                        onOk={e => console.log('ok', e)}
                        onDismiss={e => console.log('dismiss', e)}
                        >
                        <Title>
                            <span>{this.state.curFor}</span>
                            <span className='fa fa-angle-down'></span>
                        </Title>
                    </Picker>
                </NavBar>
                <DatePicker>
                    <div>suibian</div>
                {/* <List.Item arrow="horizontal">Datesss</List.Item> */}
                </DatePicker>
            </div>
        )
    }
}
export default Add