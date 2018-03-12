import React from 'react'

class Login extends React.Component {
    Login() {
        this.props.history.push('/index')
    }
    render() {
        console.log(this.props)
        return (
            <div>login
                <button onClick={this.Login.bind(this)}>Login</button>
            </div>
        )
    }
}

export default Login