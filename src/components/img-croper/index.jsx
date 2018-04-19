import React from "react";
import Styled from "styled-components";

const Container = Styled.div`
background:#000;
position:fixed;
top:0;
left:0;
height:100%;
width:100%;
z-index:1000;
`
const ButtonBar = Styled.div`
display:flex;
justify-content:space-between;
padding:0 10px;
color:#fff;
`
const CancelButton = Styled.div``
const OkButton = Styled.div``
const OriginImgContainer = Styled.div`
width:100%;
height: ${props => props.height ? props.height + 'px' : 0};
position:absolute;
left:0;
top:50%;
transform: translate(0, -50%);
`
const OriginImg = Styled.img`
width:100%;
position:absolute;
left:0;
`
const CropBox = Styled.div`
position:absolute;
border:1px solid #eee;
height:${props => props.size ? props.size + 'px' : 0};
width:${props => props.size ? props.size + 'px' : 0};
z-index:1;
`
/**
 * 
 * 
 * @class ImgCroper
 * @extends {React.Component}
 * 
 * 接收base64 / url / file类型prop
 * 成功后触发finishCrop方法 返回base64
 */
class ImgCroper extends React.Component {
    state = {
        imgWidth: 0,
        imgHeight: 0,
        cropSize: 0
    }
    onLoadImg = (e) => {
        const imgEl = e.target
        const imgHeight = imgEl.height
        const imgWidth = imgEl.width
        const cropSize = imgHeight > imgWidth ? imgWidth : imgHeight
        this.maxTop = imgHeight - cropSize
        this.maxLeft = imgWidth - cropSize
        this.setState({
            imgWidth,
            imgHeight,
            cropSize
        })
    }
    cropTouchStart = (e) => {
        const touch = e.touches[0]
        this.touchStartX = touch.pageX || touch.clientX
        this.touchStartY = touch.pageY || touch.clientY
    }
    cropTouchMove = (e) => {
        const touch = e.touches[0]
        const curX = touch.pageX || touch.clientX
        const curY = touch.pageY || touch.clientY
        const movedX = curX - this.touchStartX
        const movedY = curY - this.touchStartY
        console.log(movedX, movedY)
        const curCropTop = parseFloat(this.cropBoxEL.style.top, 10)
        const curCropLeft = parseFloat(this.cropBoxEL.style.left, 10)
        let destY = curCropTop + movedY
        let destX = curCropLeft + movedX

        if (destY > this.maxTop) {
            destY = this.maxTop
        } else if (destY < 0) {
            destY = 0
        }
        if (destX > this.maxLeft) {
            destX = this.maxLeft
        } else if (destX < 0) {
            destX = 0
        }
        console.log('======start')
        console.log('cropLeft', curCropTop)
        console.log('destX', destX)
        console.log('maxLeft', curCropLeft)
        console.log('new', destX)
        requestAnimationFrame(() => {
            this.cropBoxEL.style.top = destY + "px"
            this.cropBoxEL.style.left = destX + "px"
        })
       
        console.dir(this.cropBoxEL)
        // this.setState({
        //     cropLeft: destX,
        //     cropTop:destY
        // })
    }
    render() {
        const { imgToCrop } = this.props
        const { imgWidth, imgHeight, cropSize } = this.state
        return (
            <Container>
                <ButtonBar>
                    <CancelButton>取消</CancelButton>
                    <OkButton>完成</OkButton>
                </ButtonBar>
                <OriginImgContainer width={imgWidth} height={imgHeight}>
                    <OriginImg src={imgToCrop} onLoad={this.onLoadImg} />
                    {/* style={{top:cropTop, left:cropLeft}} */}
                    <div ref={el => this.cropBoxEL = el} style={{
                        position: "absolute",
                        border: "1px solid #eee",
                        height: cropSize ? cropSize + 'px' : 0,
                        width: cropSize ? cropSize + 'px' : 0,
                        top: 0,
                        left: 0,
                        zIndex: 1
                    }} onTouchStart={this.cropTouchStart} onTouchMove={this.cropTouchMove} />
                </OriginImgContainer>

            </Container>
        )
    }
}
export default ImgCroper