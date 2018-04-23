import React from "react";
import Styled from "styled-components";
import PropTypes from 'prop-types';
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
color:#fff;
height:40px;
font-size:14px;
`
const CancelButton = Styled.div `
margin: auto 0;
padding:5px 10px;
`
const OkButton = Styled.div `
margin: auto 0;
color:#138000;
padding:5px 10px;
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
const CropBox = Styled.div.attrs({
    style: ({ size,top,left }) => ({
      height:size,
      width:size,
      left,
      top
    }),
  })`
    border: 1px solid #eee;
position:absolute;
z-index:10;
transform: rotate(90deg);
background-repeat:no-repeat;
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
        rotate: 0
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
    componentWillMount() {
        this.getOrientation(this.props.avatarFile,(orientation) => {
            this.rotateStep = 0
            switch (orientation) {
                case 3:
                    this.rotateStep = 2;
                    break;
                case 6:
                    this.rotateStep = 1;
                    break;
                case 8:
                    this.rotateStep = 3;
                    break;
                default:
            }
            let reader = new FileReader();
            reader.onload = e => {
                const imgDataUrl = e.target.result;
                if (!imgDataUrl) {
                    if (this.props.onFail) {
                        this
                            .props
                            .onFail(`Fail to get the image`);
                    }
                    return;
                }
                // this.ctx = this .imgCanvas .getContext("2d")
                this.img = new Image()
                this.img.onload = () => {
                    this.initCanvs()
                    this.initClip()
                    this.draw()
                }
                this.img.src = imgDataUrl
            }
            reader
                .readAsDataURL(this.props.avatarFile);
        })


    }
    getPixelRatio() {
        // 注意，backingStorePixelRatio属性已弃用
        var ratio = window.devicePixelRatio || 1;
        // if (this.os.ios && this.os.iphone) {
        //     ratio *= this.options.iphoneFixedRatio || 1;
        // }
        return ratio;
    }
    initCanvs() {
        this.ctxFull = this.canvasFull.getContext('2d');
        this.canvasFull.className = 'clip-canvas-full';
        // this.smoothCtx(this.ctxFull);

        // 实际的像素比，绘制时基于这个比例绘制
        this.RATIO_PIXEL = this.getPixelRatio(this.ctxFull);
        // 获取图片的宽高比
        var wPerH = this.img.width / this.img.height;
        var oldWidth = this.container.offsetWidth || window.innerWidth;
        // container的宽度 高度
        this.oldWidth = oldWidth;
        this.oldHeight = oldWidth / wPerH;

        // 计算弧度
        var degree = this.rotateStep * 90 * Math.PI / 180;
         // 同时旋转mag canvas
         if (this.rotateStep === 0) {
            this.resizeCanvas(oldWidth, this.oldHeight);
        } else if (this.rotateStep === 1) {
            this.resizeCanvas(this.oldHeight, oldWidth);
            this.ctxFull.rotate(degree);
            this.ctxFull.translate(0, -this.canvasFull.width);
        } else if (this.rotateStep === 2) {
            this.resizeCanvas(oldWidth, this.oldHeight);
            this.ctxFull.rotate(degree);
            this.ctxFull.translate(-this.canvasFull.width, -this.canvasFull.height);
        } else if (this.rotateStep === 3) {
            this.resizeCanvas(this.oldHeight, oldWidth);
            this.ctxFull.rotate(degree);
            this.ctxFull.translate(-this.canvasFull.height, 0);
        }
    }
    resizeCanvas(width, height) {
        var maxCssHeight = window.innerHeight - 40;
        var wPerH = width / height;
        var legalWidth = this.oldWidth;
        var legalHeight = legalWidth / wPerH;

        if (maxCssHeight && legalHeight > maxCssHeight) {
            legalHeight = maxCssHeight;
            legalWidth = legalHeight * wPerH;
        }
        this.marginLeft = (this.oldWidth - legalWidth) / 2;

        this.canvasFull.style.width = legalWidth + 'px';
        this.oldWidth = legalWidth
        this.canvasFull.style.height = legalHeight + 'px';
        this.oldHeight = legalHeight
        this.canvasFull.style.marginLeft = this.marginLeft + 'px';
        this.canvasFull.width = legalWidth * this.RATIO_PIXEL;
        this.canvasFull.height = legalHeight * this.RATIO_PIXEL;

        if (this.rotateStep & 1) {
            this.scale = this.canvasFull.width / this.img.height;
        } else {
            this.scale = this.canvasFull.width / this.img.width;
        }
    }
    initClip () {
        this.clipRectSize = Math.min(this.oldHeight, this.oldWidth)
        this.clipRect.style.height = this.clipRectSize + "px"
        this.clipRect.style.width = this.clipRectSize + "px"
    }
    draw() {
       this.drawImage()
    }
    drawImage() {
        if (this.rotateStep & 1) {
            this.ctxFull.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvasFull.height, this.canvasFull.width);
        } else {
            this.ctxFull.drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvasFull.width, this.canvasFull.height);
        }
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
        console.log('start')
        const touch = e.touches[0]
        this.touchStartX = touch.pageX || touch.clientX
        this.touchStartY = touch.pageY || touch.clientY
        this.cropStartTop = this.state.cropTop // parseFloat(this.cropBoxEL.style.top, 10)
        this.cropStartLeft = this.state.cropLeft // parseFloat(this.cropBoxEL.style.left, 10)
    }
    cutImage() {
        const {cropSize, cropLeft, cropTop} = this.state
        // this.ctx = this     .imgCanvas     .getContext("2d")
        let left = cropLeft - this.minLeft
        let top = cropTop - this.minTop
        // natural是实际的像素值 drawimage的时候用的其实是natual， 所以乘上才正确
        const ratio = this.originImgEl.naturalWidth / this.originImgEl.width
        console.log(ratio)

        this
            .ctx
            .drawImage(this.originImgEl, left * ratio, top * ratio, cropSize * ratio, cropSize * ratio, 0, 0, cropSize, cropSize)

    }
    cropTouchMove = (e) => {
        console.log('move')
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
        var degree = 90 * Math.PI / 180;

        // ctx.rotate(degree);

        // natural是实际的像素值 drawimage的时候用的其实是natual， 所以乘上才正确
        const ratio = this.originImgEl.naturalWidth / this.originImgEl.width
        ctx.drawImage(this.originImgEl,  top * ratio,left * ratio, cropSize * ratio, cropSize * ratio, 0, 0, cropSize, cropSize)
        // this.ctx.drawImage(this.originImgEl,  top * ratio,left * ratio, cropSize *
        // ratio, cropSize * ratio, 0, 0, cropSize, cropSize) const dataUrl = this
        // .imgCanvas     .toDataURL('image/jpeg', quality); this.props.onComplete &&
        // this     .props     .onComplete(dataUrl)
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
                <div ref={el => this.container = el} style={{position: "relative", width:this.oldWidth, height: this.oldHeight}}>
                  <canvas ref={el => this.canvasFull = el} style={{position:"absolute", left:0}}></canvas>
                  <div ref={el => this.clipRect = el} style={{position:"absolute", border: "1px solid #eee"}}></div>
                </div>
               
                {/* <OriginImgContainer
                    width={imgWidth}
                    height={imgHeight}
                    innerRef={el => this.originContainerImgEl = el}>
                    {imgDataUrl && <OriginImg
                        src={imgDataUrl}
                        onLoad={this.onLoadImg}
                        innerRef={el => this.originImgEl = el}/>}
                    <ImgOverLay width={imgWidth} height={imgHeight}/>
                    <CropBox
                        size={cropSize}
                        ref={el => this.cropBoxEL = el}
                        top={cropTop}
                        bgTop={-(cropTop - this.minTop)}
                        bgLeft={-(cropLeft - this.minLeft)}
                        left={cropLeft}
                        onTouchStart={this.cropTouchStart}
                        onTouchMove={this.cropTouchMove}></CropBox>
                    <canvas
                        style={{
                        "zIndex": 10000,
                        position: "fixed",
                        bottom: 0,
                        width:cropSize + "px",
                        height:cropSize + "px",
                        left: 0
                    }}
                        ref={el => this.imgCanvas = el}
                        height={cropSize * 2}
                        width={cropSize * 2}></canvas>
                </OriginImgContainer> */}

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