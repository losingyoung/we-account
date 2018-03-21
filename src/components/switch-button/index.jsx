import React from 'react'
import PropTypes from 'prop-types';
import * as Styled from './Styled'

const Blue = "#108ee9"
export default class SwitchButton extends React.Component{
   render() {
       let props = this.props
       let activeSide = props.data.left.value === props.value ? "left" : "right"
       let leftLabel = props.data.left.label //activeSide === "left" ? props.data.left.label : ""
       let rightLabel = props.data.right.label //activeSide === "right" ? props.data.right.label : ""
       return (
           <Styled.SwitchContainer>
               <Styled.LeftButton onClick={() => {props.onSwitch(props.data.left.value)}} active={activeSide === 'left'} activeColor={props.activeColor.left} closeColor={props.closeColor}>{leftLabel}</Styled.LeftButton>
               <Styled.RightButton onClick={() => {props.onSwitch(props.data.right.value)}} active={activeSide === 'right'} activeColor={props.activeColor.right} closeColor={props.closeColor}>{rightLabel}</Styled.RightButton>
           </Styled.SwitchContainer>
       )
   }
}

SwitchButton.propTypes = {
    value:PropTypes.any,
    data:PropTypes.shape({
        left: PropTypes.shape({
            value: PropTypes.any,
            label: PropTypes.string
        }),
        right: PropTypes.shape({
            value: PropTypes.any,
            label: PropTypes.string
        })
    }),
    leftText:PropTypes.string,
    rightText:PropTypes.string,
    textColor: PropTypes.string,
    closeColor: PropTypes.string,
    activeColor: (PropTypes.shape({
        left: PropTypes.string,
        right: PropTypes.string
    }))
}
SwitchButton.defaultProps = {
    data:{
        left:{
            value: 'on',
            label: 'ON'
        },
        right: {
            value: 'off',
            label: 'OFF'
        }
    },
    closeColor: "#eee",
    activeColor: {
        left: Blue,
        right: Blue
    }
}