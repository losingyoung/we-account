import React from "react";
import Styled from "styled-components";
import PropTypes from 'prop-types';
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
height:40px;
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
height:calc(100% - 40px);
position:absolute;
left:0;

`
const OriginImg = Styled.img `
max-width:100%;
max-height:100%;
position:absolute;
left:50%;
top:50%;
/* transform:  ${props => "translate(-50%, -50%) rotate(" + props.rotate + "deg)"}; */
transform:  ${props => "translate(-50%, -50%) rotate(" + 0 + "deg)"};
`
const ImgOverLay = Styled.div `
height: ${props => props.height
    ? props.height + 'px'
    : 0};
    width: ${props => props.width
        ? props.width + 'px'
        : 0};
position:absolute;
left:50%;
top:50%;
transform: translate(-50%, -50%);
opacity:0.7;
background:#000;
`
const CropBox = Styled
    .div
    .attrs({
        style: ({top, left, size, bgTop, bgLeft}) => ({top, left, height: size, width: size, "backgroundPosition": `${bgTop}px ${bgLeft}px`})
    })`
position:absolute;
z-index:1;
transform: rotate(90deg);
background-repeat:no-repeat;
background-image: url(${props => props.imgUrl});
background-size: ${props => props.imgHeight + "px " + props.imgWidth + "px"};
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
        cropTop: 0,
        imgDataUrl: ''
    }
    componentWillMount() {
        if (this.reader) {
            return
        }
        this.reader = new FileReader();
        this.reader.onload = e => {
            const imgDataUrl = e.target.result;
            if (!imgDataUrl) {
                if (this.props.onFail) {
                    this
                        .props
                        .onFail(`Fail to get the image`);
                }
                return;
            }
            // this.ctx = this
            // .imgCanvas
            // .getContext("2d")
            this.setState({ imgDataUrl})
            // this.ctx.rotate(90*Math.PI/180)
        }
        this
            .reader
            .readAsDataURL(this.props.avatarFile);

    }
    onLoadImg = (e) => {
        const imgEl = e.target
        const imgHeight = imgEl.height
        const imgWidth = imgEl.width
        const cropSize = imgHeight > imgWidth
            ? imgWidth
            : imgHeight
        const cropLeft = this.minLeft = (this.originContainerImgEl.clientWidth - imgWidth) / 2
        const cropTop = this.minTop = (this.originContainerImgEl.clientHeight - imgHeight) / 2
        this.maxTop = imgHeight - cropSize + cropTop
        this.maxLeft = imgWidth - cropSize + cropLeft
        // console.log(cropLeft, cropTop)
        this.setState({
            imgWidth,
            imgHeight,
            cropSize,
            cropLeft,
            cropTop
        }, () => {
            // this.cutImage()
        })
    }
    cropTouchStart = (e) => {
        const touch = e.touches[0]
        this.touchStartX = touch.pageX || touch.clientX
        this.touchStartY = touch.pageY || touch.clientY
        this.cropStartTop = this.state.cropTop // parseFloat(this.cropBoxEL.style.top, 10)
        this.cropStartLeft = this.state.cropLeft // parseFloat(this.cropBoxEL.style.left, 10)
    }
    cutImage() {
        const {cropSize, cropLeft, cropTop} = this.state
        // this.ctx = this
        //     .imgCanvas
        //     .getContext("2d")
        let left = cropLeft - this.minLeft
        let top = cropTop - this.minTop
        // natural是实际的像素值 drawimage的时候用的其实是natual， 所以乘上才正确
        const ratio = this.originImgEl.naturalWidth / this.originImgEl.width
        console.log(ratio)
        
        this.ctx.drawImage(this.originImgEl, left * ratio, top * ratio, cropSize * ratio, cropSize * ratio, 0, 0, cropSize, cropSize)
   
       
    }
    cropTouchMove = (e) => {
        const touch = e.touches[0]
        const curX = touch.pageX || touch.clientX
        const curY = touch.pageY || touch.clientY
        const movedX = curX - this.touchStartX
        const movedY = curY - this.touchStartY
        let destY = this.cropStartTop + movedY
        let destX = this.cropStartLeft + movedX

        if (destY < this.minTop) {
            destY = this.minTop

        } else if (destY > this.maxTop) {
            destY = this.maxTop
        }
        if (destX < this.minLeft) {
            destX = this.minLeft

        } else if (destX > this.maxLeft) {
            destX = this.maxLeft
        }
        this.setState({
            cropLeft: destX,
            cropTop: destY
        }, () => {
            // this.cutImage()
        })
    }
    onComplete = () => {
        const {cropSize, cropLeft, cropTop} = this.state
        const quality = 0.92
        let ctx = this
            .imgCanvas
            .getContext("2d")
        let left = cropLeft - this.minLeft
        let top = cropTop - this.minTop
        // natural是实际的像素值 drawimage的时候用的其实是natual， 所以乘上才正确
        const ratio = this.originImgEl.naturalWidth / this.originImgEl.width
        ctx.drawImage(this.originImgEl, left * ratio, top * ratio, cropSize * ratio, cropSize * ratio, 0, 0, cropSize, cropSize)
        // this.ctx.drawImage(this.originImgEl,  top * ratio,left * ratio, cropSize * ratio, cropSize * ratio, 0, 0, cropSize, cropSize)
        // const dataUrl = this
        //     .imgCanvas
        //     .toDataURL('image/jpeg', quality);
        // this.props.onComplete && this
        //     .props
        //     .onComplete(dataUrl)
        ctx.rotate(130 * (Math.PI / 180))
    }
    render() {
        const {onCancel} = this.props
        const {
            imgWidth,
            imgDataUrl,
            imgHeight,
            cropSize,
            cropTop,
            cropLeft
        } = this.state
        return (
            <Container>
                <ButtonBar>
                    <CancelButton onClick={onCancel}>取消</CancelButton>
                    <OkButton onClick={this.onComplete}>完成</OkButton>
                </ButtonBar>
                <OriginImgContainer
                    width={imgWidth}
                    height={imgHeight}
                    innerRef={el => this.originContainerImgEl = el}>
                    {imgDataUrl && <OriginImg
                        src={imgDataUrl}
                        onLoad={this.onLoadImg}
                        innerRef={el => this.originImgEl = el}/>}
                    <ImgOverLay  width={imgWidth} height={imgHeight}/>
                    <CropBox
                        size={cropSize}
                        ref={el => this.cropBoxEL = el}
                        top={cropTop}
                        imgUrl = {imgDataUrl}
                        imgWidth = {imgWidth}
                        imgHeight={imgHeight}
                        bgTop = {-(cropTop - this.minTop)}
                        bgLeft = {-(cropLeft - this.minLeft)}
                        left={cropLeft}
                        onTouchStart={this.cropTouchStart}
                        onTouchMove={this.cropTouchMove}>
                        
                    </CropBox>
                    <canvas style={{"zIndex":10000,position: "fixed",top:0,left:0}} ref={el => this.imgCanvas = el} height={cropSize} width={cropSize}></canvas>
                </OriginImgContainer>

            </Container>
        )
    }
}
ImgCroper.propTypes = {
    imgToCrop: PropTypes.string,
    avatarFile: PropTypes.any,
    onComplete: PropTypes.func,
    onCancel: PropTypes.func
}
export default ImgCroper