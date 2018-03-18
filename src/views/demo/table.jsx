import React from 'react'

const columns = ['name', 'age']
class Table extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            originItems: [{
                id: 1,
                name: 'nnn',
                age: 222
            }, {
                id: 2,
                name: 'aaa',
                age: 233
            }],
            items: [{
                id: 1,
                name: 'nnn',
                age: 222
            }, {
                id: 2,
                name: 'aaa',
                age: 233
            }],
            nextId:3
        }
    }
    componentWillMount () {
       
    }
    changeValue( id, field, e) {
        const items = this.state.items
        items.some(item => {
            if (item.id === id) {
                item[field] = e.target.value
                return true
            } else {
                return false
            }
        })
        this.setState({items})
    }
    addRow() {
        const items = this.state.items.slice(0)
        const newItem = {
            id: this.state.nextId,
            name: '',
            age: ''
        }
        items.push(newItem)
        this.setState({items,
        nextId: this.state.nextId + 1
    })
        
    }
    deleteRow(id) {
        const items = this.state.items.slice(0)
       this.setState({
           items:items.filter(item => {
               if (item.id !== id) {
                   return true
               }
               return false
           })
       }) 
    }
    async save() {
        const addItems = []
        const updateItems = []
        const delItems = []
        this.state.originItems.forEach(origin => {
            let isDel = true
            this.state.items.some(item => {
               if (origin.id === item.id) {
                isDel = false
                return true
               }
               return false              
            })
            if (isDel) {
                delItems.push(origin)
            }
        })
        this.state.items.forEach(item => {
            let isAdd = true
            this.state.originItems.some(origin => {
               if (origin.id === item.id) {
                isAdd = false
                return true
               }        
               return false      
            })
            if (isAdd) {
                addItems.push(item)
            } else {
                updateItems.push(item)
            }
        })
       await this.props.service.add(addItems)
       await this.props.service.update(addItems)
       await this.props.service.delete(addItems)
       alert('finish')
        console.log('add', addItems, 'update', updateItems, 'remove', delItems)
    }
    render() {
        const tBody = this.state.items.map((item, idx) => {
            return (
                <tr key={idx}>{columns.map(field => {
                    return <td key={field}><input value={item[field]} onChange={this.changeValue.bind(this, item.id, field)} /></td>
                })}
                <td key='remove' onClick={this.deleteRow.bind(this, item.id)}><i  className='fa fa-minus-circle' /></td>
                </tr>
            )
        })
        return (
            <div>
                <div onClick={this.addRow.bind(this)}><i className='fa fa-plus-circle' /></div>
                <table style={{width:0,margin:"0 auto"}}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                        </tr>
                    </thead>
                    <tbody>{tBody}</tbody>
                </table>
                <br />
               <button onClick={this.save.bind(this)}>保存</button>
                
            </div>
        )
    }
}
export default Table