import React from "react";
import Styled from "styled-components";
import PropTypes from 'prop-types';
// import './image-process/dist/image-clip.js'
// import './image-process/dist/image-clip.css'
import './plugin/image-clip.js'
import './plugin/image-clip.css'
const Container = Styled.div `
background:#000;
position:fixed;
top:0;
left:0;
height:100%;
width:100%;
z-index:1000;
`
const ButtonBar = Styled.div `
display:flex;
justify-content:space-between;
padding:0 10px;
color:#fff;
height:30px;
font-size:14px;
`
const CancelButton = Styled.div `
margin: auto 0;
`
const OkButton = Styled.div `
margin: auto 0;
color:#138000;
`
const OriginImgContainer = Styled.div `
width:100%;

height: ${props => props.height
    ? props.height + 'px'
    : 0};
height:calc(100% - 30px);
position:absolute;
left:0;

`
const OriginImg = Styled.img `
max-width:100%;
max-height:100%;
position:absolute;
left:50%;
top:50%;
transform: translate(-50%, -50%);
`
const CropBox = Styled
    .div
    .attrs({
        style: ({top, left, size}) => ({top, left, height: size, width: size})
    })`
position:absolute;
border:1px solid #eee;
z-index:1;
`
/**
 *
 *
 * @class ImgCroper
 * @extends {React.Component}
 *
 * 接收base64 / url / file类型prop
 * 成功后触发onComplete方法 返回base64
 */
class ImgCroper extends React.Component {
    state = {
        imgWidth: 0,
        imgHeight: 0,
        cropSize: 0,
        cropLeft: 0,
        cropTop: 0
    }
    onLoadImg = (e) => {
        const imgEl = e.target
        const imgHeight = imgEl.height
        const imgWidth = imgEl.width
    
        this.setState({imgWidth, imgHeight})
        console.log(window)
       new window.ImageClip({
           container: "#imgCon",
            img:this.originImgEl
        });
    }
    onComplete = () => {
     
        // this.props.onComplete && this
        //     .props
        //     .onComplete()
    }
    render() {
        const {imgToCrop, onCancel} = this.props
        const {imgWidth, imgHeight} = this.state
        return (
            <Container>
                <ButtonBar>
                    <CancelButton onClick={onCancel}>取消</CancelButton>
                    <OkButton onClick={this.onComplete}>完成</OkButton>
                </ButtonBar>
                <div
                    width={imgWidth}
                    height={imgHeight}
                    ref={el => this.originContainerImgEl = el}>
                    <img
                        src={imgToCrop}
                        onLoad={this.onLoadImg}
                        style={{width:"100%"}}
                        ref={el => this.originImgEl = el}/>
                </div>
<canvas id="imgCon" style={{zIndex:10000}}></canvas>
            </Container>
        )
    }
}
ImgCroper.propTypes = {
    imgToCrop: PropTypes.string,
    onComplete: PropTypes.func,
    onCancel: PropTypes.func
}
export default ImgCroper