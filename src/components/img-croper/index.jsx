import React from "react";
import Styled from "styled-components";
import PropTypes from 'prop-types';
// import './plugin/image-clip.js' import './plugin/image-clip.css'
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
const ImgContainer = Styled.div `
    position: relative;
    width: 100%;
    height: calc(100% - 40px);
`
const ImgCanvas = Styled.canvas`
    position: absolute;
    left: 0;
`
const ClipRect = Styled.div`
position:absolute;
top:${props => props.top + "px"};
left:${props => props.left + "px"};
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
        this.getOrientation(this.props.avatarFile, (orientation) => {
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
            reader.readAsDataURL(this.props.avatarFile);
        })

    }
    // referred to https://github.com/dailc/image-process
    /**
     * 获取devicePixelRatio(像素比)
     * canvas绘制时乘以缩放系数，防止裁剪不清晰
     * （譬如320的手机上可能裁剪出来的就是640-系数是2）
     */

    getPixelRatio() {
        // 注意，backingStorePixelRatio属性已弃用
        var ratio = window.devicePixelRatio || 1;
        // if (this.os.ios && this.os.iphone) {     ratio *=
        // this.options.iphoneFixedRatio || 1; }
        return ratio;
    }
    initCanvs() {
        this.ctxFull = this
            .canvasFull
            .getContext('2d');
        this.canvasFull.className = 'clip-canvas-full';
        // this.smoothCtx(this.ctxFull); 实际的像素比，绘制时基于这个比例绘制
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
            this
                .ctxFull
                .rotate(degree);
            this
                .ctxFull
                .translate(0, -this.canvasFull.width);
        } else if (this.rotateStep === 2) {
            this.resizeCanvas(oldWidth, this.oldHeight);
            this
                .ctxFull
                .rotate(degree);
            this
                .ctxFull
                .translate(-this.canvasFull.width, -this.canvasFull.height);
        } else if (this.rotateStep === 3) {
            this.resizeCanvas(this.oldHeight, oldWidth);
            this
                .ctxFull
                .rotate(degree);
            this
                .ctxFull
                .translate(-this.canvasFull.height, 0);
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
        this.marginTop = (this.container.clientHeight - legalHeight) / 2
        this.canvasFull.style.marginTop = this.marginTop + "px"
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
        // this.setState({     cropLeft: this.marginLeft,     cropTop: this.canvasTop })
    }
    initClip() {
        this.clipRectSize = Math.min(this.oldHeight, this.oldWidth)
        this.clipRect.style.height = this.clipRectSize + "px"
        this.clipRect.style.width = this.clipRectSize + "px"
        this.clipRect.style.marginLeft = this.marginLeft + "px"
        this.clipRect.style.marginTop = this.marginTop + "px"
        this.minTop = 0
        this.minLeft = 0
        this.maxTop = this.oldHeight - this.clipRectSize//Math.max()
        this.maxLeft = this.oldWidth - this.clipRectSize//Math.max()
        this.setState({
            cropLeft: (this.oldWidth - this.clipRectSize) /2,
            cropTop: (this.oldHeight - this.clipRectSize) /2
        })
    }
    draw() {
        if (this.rotateStep & 1) {
            this
                .ctxFull
                .clearRect(0, 0, this.canvasFull.height, this.canvasFull.width)
        } else {
            this
                .ctxFull
                .clearRect(0, 0, this.canvasFull.width, this.canvasFull.height)
        }

        this.drawImage()
        this.drawMask()

        const {cropTop, cropLeft} = this.state
        this
            .ctxFull
            .save()
        this
            .ctxFull
            .beginPath();
        if (this.rotateStep & 1) {
            this
                .ctxFull
                .rect(cropTop * this.RATIO_PIXEL, cropLeft * this.RATIO_PIXEL, this.clipRectSize * this.RATIO_PIXEL, this.clipRectSize * this.RATIO_PIXEL)
        } else {
            this
                .ctxFull
                .rect(cropLeft * this.RATIO_PIXEL, cropTop * this.RATIO_PIXEL, this.clipRectSize * this.RATIO_PIXEL, this.clipRectSize * this.RATIO_PIXEL)
        }

        this
            .ctxFull
            .clip()
        this.drawImage()
        this
            .ctxFull
            .restore()
    }
    drawImage() {
        if (this.rotateStep & 1) {
            this
                .ctxFull
                .drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvasFull.height, this.canvasFull.width)
        } else {
            this
                .ctxFull
                .drawImage(this.img, 0, 0, this.img.width, this.img.height, 0, 0, this.canvasFull.width, this.canvasFull.height)
        }
    }
    drawMask() {
        this
            .ctxFull
            .save()
        this.ctxFull.fillStyle = 'rgba(0, 0, 0, 0.3)'
        if (this.rotateStep & 1) {
            this
                .ctxFull
                .fillRect(0, 0, this.canvasFull.height, this.canvasFull.width)
        } else {
            this
                .ctxFull
                .fillRect(0, 0, this.canvasFull.width, this.canvasFull.height)
        }
        this
            .ctxFull
            .restore()
    }
    cropTouchStart = (e) => {
        console.log('start')
        this.touchStartX = e.touches
            ? e.touches[0].pageX
            : e.pageX
        this.touchStartY = e.touches
            ? e.touches[0].pageY
            : e.pageY
        this.cropStartTop = this.state.cropTop // parseFloat(this.cropBoxEL.style.top, 10)
        this.cropStartLeft = this.state.cropLeft // parseFloat(this.cropBoxEL.style.left, 10)
    }
    cropTouchMove = (e) => {
        console.log('move')
        const curX = e.touches
            ? e.touches[0].pageX
            : e.pageX
        const curY = e.touches
            ? e.touches[0].pageY
            : e.pageY
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
        this.setState({cropLeft: destX, cropTop: destY})

        this.draw()
    }
    onComplete = () => {
        try {
            const {cropLeft, cropTop} = this.state
            const quality = 0.92
            this.transferCanvas.width = this.clipRectSize
            this.transferCanvas.style.width = this.clipRectSize + "px"
            this.transferCanvas.height = this.clipRectSize
            this.transferCanvas.style.height = this.clipRectSize + "px"
            // img 是图像本身的尺寸 canvas width是页面上拉伸过的
            console.log('this.canvasFull.width', this.canvasFull.width)
            console.log('img.width', this.img.width)
            let transferCtx = this
                .transferCanvas
                .getContext("2d")
            // this.rotateStep = 1
            var degree = this.rotateStep * 90 * Math.PI / 180;
            if (this.rotateStep === 0) {} else if (this.rotateStep === 1) {
                transferCtx.rotate(degree);
                transferCtx.translate(0, -this.transferCanvas.width);
            } else if (this.rotateStep === 2) {
                transferCtx.rotate(degree);
                transferCtx.translate(-this.transferCanvas.width, -this.transferCanvas.height);
            } else if (this.rotateStep === 3) {
                transferCtx.rotate(degree);
                transferCtx.translate(-this.transferCanvas.height, 0);
            }

            if (this.rotateStep & 1) {
                // 最终像素要根据图片的来
                transferCtx.drawImage(this.img, cropTop * this.RATIO_PIXEL / this.scale, cropLeft * this.RATIO_PIXEL / this.scale, this.clipRectSize * this.RATIO_PIXEL / this.scale, this.clipRectSize * this.RATIO_PIXEL / this.scale, 0, 0, this.clipRectSize, this.clipRectSize)
            } else {
                transferCtx.drawImage(this.img, cropLeft * this.RATIO_PIXEL / this.scale, cropTop * this.RATIO_PIXEL / this.scale, this.clipRectSize * this.RATIO_PIXEL / this.scale, this.clipRectSize * this.RATIO_PIXEL / this.scale, 0, 0, this.clipRectSize, this.clipRectSize)
            }
            const dataUrl = this
                .transferCanvas
                .toDataURL('image/jpeg', quality);
            this.props.onComplete && this
                .props
                .onComplete(dataUrl)
        } catch (error) {
            this.props.onComplete && this
                .props
                .onComplete()
        }
    }
    render() {
        const {onCancel} = this.props
        const {cropTop, cropLeft} = this.state
        return (
            <Container>
                <ButtonBar>
                    <CancelButton onClick={onCancel}>取消</CancelButton>
                    <OkButton onClick={this.onComplete}>完成</OkButton>
                </ButtonBar>
                <ImgContainer innerRef={el => this.container = el}>
                    <ImgCanvas innerRef={el => this.canvasFull = el}/>
                    <ClipRect innerRef={el => this.clipRect = el} onTouchStart={this.cropTouchStart}
                        onTouchMove={this.cropTouchMove} top={cropTop} left={cropLeft}/>
                    <canvas ref={el => this.transferCanvas = el}></canvas>
                </ImgContainer>
            </Container>
        )
    }
}
ImgCroper.propTypes = {
    avatarFile: PropTypes.any,
    onComplete: PropTypes.func,
    onCancel: PropTypes.func
}
export default ImgCroper