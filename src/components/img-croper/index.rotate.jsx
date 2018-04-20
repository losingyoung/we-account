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
        style: ({top, left, size}) => ({top, left, height: size, width: size})
    })`
position:absolute;
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
        cropTop: 0,
        imgDataUrl: '',
        imgRotate: 90
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

            let orientation = 1;
            this.getOrientation(this.props.avatarFile, res => {
                if (res > 0) {
                    orientation = res;
                }
                let roteDeg = this.getRotation(orientation)
                this.setState({imgRotate: roteDeg, imgDataUrl})
            })
        }
        this
            .reader
            .readAsDataURL(this.props.avatarFile);

    }
    // http://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-
    // in-javascript-on-the-client-side
    getOrientation = (file, callback) => {
        const reader = new FileReader();
        reader.onload = e => {
            const view = new DataView(e.target.result);
            if (view.getUint16(0, false) !== 0xffd8) {
                return callback(-2);
            }
            const length = view.byteLength;
            let offset = 2;
            while (offset < length) {
                const marker = view.getUint16(offset, false);
                offset += 2;
                if (marker === 0xffe1) {
                    const tmp = view.getUint32((offset += 2), false);
                    if (tmp !== 0x45786966) {
                        return callback(-1);
                    }
                    const little = view.getUint16((offset += 6), false) === 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    const tags = view.getUint16(offset, little);
                    offset += 2;
                    for (let i = 0; i < tags; i++) {
                        if (view.getUint16(offset + i * 12, little) === 0x0112) {
                            return callback(view.getUint16(offset + i * 12 + 8, little));
                        }
                    }
                } else if ((marker & 0xff00) !== 0xff00) {
                    break;
                } else {
                    offset += view.getUint16(offset, false);
                }
            }
            return callback(-1);
        };
        reader.readAsArrayBuffer(file.slice(0, 64 * 1024));
    }

    getRotation = (orientation = 1) => {
        let imgRotation = 0;
        switch (orientation) {
            case 3:
                imgRotation = 180;
                break;
            case 6:
                imgRotation = 90;
                break;
            case 8:
                imgRotation = 270;
                break;
            default:
        }
        return imgRotation;
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

        let ctx = this
            .imgCanvas
            .getContext("2d")
        let left = cropLeft - this.minLeft
        let top = cropTop - this.minTop
        // natural是实际的像素值 drawimage的时候用的其实是natual， 所以乘上才正确
        const ratio = this.originImgEl.naturalWidth / this.originImgEl.width
        console.log(ratio)
        ctx.drawImage(this.originImgEl, left * ratio, top * ratio, cropSize * ratio, cropSize * ratio, 0, 0, cropSize, cropSize)

        // const quality = 0.92 const dataUrl = this     .imgCanvas
        // .toDataURL('image/jpeg', quality); this.props.onComplete && this     .props
        // .onComplete(dataUrl)
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
            this.cutImage()
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
        console.log(ratio)
        ctx.drawImage(this.originImgEl, left * ratio, top * ratio, cropSize * ratio, cropSize * ratio, 0, 0, cropSize, cropSize)
        const dataUrl = this
            .imgCanvas
            .toDataURL('image/jpeg', quality);
        this.props.onComplete && this
            .props
            .onComplete(dataUrl)
    }
    render() {
        const {onCancel} = this.props
        const {
            imgWidth,
            imgDataUrl,
            imgRotate,
            imgHeight,
            cropSize,
            cropTop,
            cropLeft
        } = this.state
        alert('rotate'+imgRotate)
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
                        rotate={imgRotate}
                        src={imgDataUrl}
                        onLoad={this.onLoadImg}
                        innerRef={el => this.originImgEl = el}/>}
                    {/* <ImgOverLay  width={imgWidth} height={imgHeight}/> */}
                    {/* <CropBox
                        size={cropSize}
                        ref={el => this.cropBoxEL = el}
                        top={cropTop}
                        left={cropLeft}
                        onTouchStart={this.cropTouchStart}
                        onTouchMove={this.cropTouchMove}>
                        <canvas ref={el => this.imgCanvas = el} height={cropSize} width={cropSize}></canvas>
                    </CropBox> */}

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