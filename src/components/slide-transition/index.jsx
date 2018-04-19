import React from "react";
import {TransitionGroup, CSSTransition} from "react-transition-group";
import PropTypes from 'prop-types'
import './index.css'
class TransitionSlide extends React.Component {
    render() {
        const {transtionName, locationKey} = this.props
        const timeout = 300 //由于这里要与css里面transition的time一致，所以暂时定死
        return (
            <TransitionGroup>
              <CSSTransition key={locationKey} classNames={transtionName} timeout={timeout}>
                {this.props.children}
              </CSSTransition>
            </TransitionGroup>
        )
    }
}
TransitionSlide.defaultProps = {
    transtionName: 'slideLeft'
}
TransitionSlide.propTypes = {
    transtionName: PropTypes.oneOf(['slideRight', 'slideLeft']),
    locationKey : PropTypes.string
}

export default TransitionSlide