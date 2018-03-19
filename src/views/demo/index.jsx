import React from 'react'
// import Tabs from "antd-mobile/lib/input-item";
import Tabs from 'antd/lib/tabs';
import DemoTable from './table'

import {koaService, expressService} from '../../service'
const TabPane = Tabs.TabPane; 


class Demo extends React.Component {
    render() {
        return (
            <div>Node Demo
                <Tabs>
                  <TabPane tab="Express + MongoDB" key="1">
                    <DemoTable service={expressService} generateKey={true}></DemoTable>
                  </TabPane>
                  <TabPane tab="Koa + MySql" key="2">
                  <DemoTable service={koaService} generateKey={false}></DemoTable>
                  </TabPane>
                </Tabs>
            </div>
        )
    }
}
export default Demo