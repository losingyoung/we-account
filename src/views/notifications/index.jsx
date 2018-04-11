import React from 'react'
import { Tabs, Badge, Modal } from 'antd-mobile';
import * as Service from '../../service'
import NotificationItem from './notification-item'

const tabs = [
    { title: <Badge>通知</Badge> },
    // { title: <Badge text={'3'}>消息</Badge> }
];
class Notifications extends React.Component {
    state = {
        notifications: null
    }
    componentDidMount() {
        let params = {
            wa_code: 777
        }
        Service.getNotifications(params).then(res => {
            let data = res.data
            if (data.success) {
                this.setState({
                    notifications: data.notifications
                })
            }
        })
    }
    acceptRequest = (item) => {
        Service.acceptRequest(item).then(res => {
            let data = res.data
            if (data.success) {
                this.setState({
                    notifications: this.state.notifications.map(noti => {
                        if (noti.id === item.id) {
                            return Object.assign({}, item, {status: "1"})
                        }
                        return noti
                    })
                })
            }
        })
    }
    refuseRequest = (item) => {
        Modal.prompt("确认", "留言：",[
            { text: '取消' },
            { text: '确认', onPress: value => {
                Service.refuseRequest(item).then(res => {
                    let data = res.data
                    if (data.success) {
                        this.setState({
                            notifications: this.state.notifications.map(noti => {
                                if (noti.id === item.id) {
                                    return Object.assign({}, item, {status: "2"})
                                }
                                return noti
                            })
                        })
                    }
                })
            } },
          ])
    }
    render() {
        const {notifications} = this.state
        return (
            <div>
                <Tabs tabs={tabs}
                    initialPage={0}
                    onChange={(tab, index) => { console.log('onChange', index, tab); }}
                    onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
                >
                    <div >
                        {notifications && notifications.map(item => {
                            return <NotificationItem {...item} key={item.id} acceptRequest={() => {this.acceptRequest(item)}} refuseRequest={() => {this.refuseRequest(item)}}/>
                        })}
                    </div>

                    {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                        Content of second tab
      </div> */}
                </Tabs>
            </div>
        )
    }
}
export default Notifications