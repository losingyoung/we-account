import React, {Component} from 'react'
import PropTypes from 'prop-types';
import './index.css'

class Toggle extends Component {
    render() {
        const {show, children} = this.props
        let wrapperClassName = show ? '' : 'toggle-hide-item'
        return (
            <div className={wrapperClassName}>
                {children}
            </div>
        )
    }
}
Toggle.propTypes = {
    show: PropTypes.bool
}
Toggle.defaultProps = {
    show: true
}
export default Toggle