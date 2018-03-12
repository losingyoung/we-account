import React from 'react'

class Me extends React.Component {
    logout() {
      this.props.history.replace('/')
    }
    render() {
        return (
            <div>
                image / name / info / 
                <button onClick={() => {this.logout()}}>logout</button>
            </div>
        )
    }
}
export default Me