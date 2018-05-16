import React from 'react'
class Test extends React.Component {
    state = {
        uploadedImg: null
    }
    setImgData = () => {
        let file = this.inputEl.files
        let reader = new FileReader();
            reader.onload = e => {
                const imgDataUrl = e.target.result;
                if (!imgDataUrl) {
                    return;
                }
                this.setState({
                    uploadedImg: imgDataUrl
                })
            }
            reader.readAsDataURL(file[0]);
    }
    drawCanvas = () => {
        let file = this.inputEl.files
        let reader = new FileReader();
            reader.onload = e => {
                const imgDataUrl = e.target.result;
                if (!imgDataUrl) {
                    return;
                }
                // this.ctx = this .imgCanvas .getContext("2d")
                this.img = new Image()
                this.img.onload = () => {
                    this.drawImage()
                }
                this.img.src = imgDataUrl
            }
            reader.readAsDataURL(file[0]);
        
    }
    drawImage() {
        const ctx = this.canvasEl.getContext('2d')
        ctx.fillStyle= 'rgba(0, 0, 0, 0.3)'
        ctx.fillRect(0, 0, 2000, 1000)
        // ctx.drawImage(this.img, 0, 0, 1024, 768)
        ctx.drawImage(this.img, 100, 50, 800, 700, 0, 0, 512, 384)
        // ctx.drawImage(this.img, 0, 0, 1024, 768, 0, 0, 200, 100)
    }
    render() {
        const { uploadedImg } = this.state
        return (
            <div>test
                <input type="file" ref={el => this.inputEl = el} onChange={this.setImgData}/>
                <button onClick={this.drawCanvas}>draw</button>
                <hr/>
                <img  src={uploadedImg}/>
                <hr/>
                <canvas ref={el => this.canvasEl = el} width='800' height='500'/> 
            </div>
        )
    }
}
export default Test