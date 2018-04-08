import React from 'react'
import { Tabs, WhiteSpace, Badge } from 'antd-mobile';
import * as Service from '../../service'
import NotificationItem from './notification-item'

const tabs = [
    { title: <Badge dot>通知</Badge> },
    { title: <Badge text={'3'}>消息</Badge> }
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
            console.log(data)
            if (data.success) {
                this.setState({
                    notifications: data.notifications
                })
            }
 
        })
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
                            return <NotificationItem {...item} key={item.id}/>
                        })}
      </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                        Content of second tab
      </div>
                </Tabs>
            </div>
        )
    }
}

export default Notifications