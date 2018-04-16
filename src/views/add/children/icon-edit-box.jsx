import React from "react";
import {CategoryArea} from '../Styled'
// 弹出来的分类按钮编辑框
class IconEditBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: props.title || "",
            activeCateType: props.activeCateType,
            iconWidth: 0
        }
    }
    setActiveIcon = (type) => {
        this.setState({
            activeCateType: type
        })
    }
    changeCateTitle = (e) => {
        e.preventDefault()
        this.setState({
            title: e.target.value
        })
    }
    confirmChange = () => {
        let { title, activeCateType } = this.state
        this.props.confirmEdit && this.props.confirmEdit({
            title,
            activeCateType
        })
    }
    componentDidMount() {
        // const el = document.querySelector('.icon-edit-wrapper')
        const clientWidth = this.boxBody.clientWidth
        const oneLineCount = 5
        const iconWidth = (clientWidth - 14) / oneLineCount - 20
        this.setState({
            iconWidth
        })
    }
    render() {
        let { activeCateType, title, iconWidth } = this.state
        let {icons} = this.props
        return (
            <div className="icon-edit-wrapper" ref={el => this.boxBody = el}>
                <div className="title-container">
                    <input value={title} onChange={this.changeCateTitle} />
                </div>
                <div className="operation-buttons">
                    <span onClick={this.confirmChange}><i className='fa fa-check' /></span>
                    {/* <span><i className='fa fa-times-circle'/></span> */}
                </div>
                <div className="icons-container">
                    <CategoryArea iconWidth={iconWidth}>
                        {Object.keys(icons)
                            .map(type => {
                                return (
                                    <div
                                        key={type}
                                        className={`cate-item-wrapper ${type === activeCateType
                                            ? "active"
                                            : ""}`}
                                        onClick={() => {
                                            this.setActiveIcon(type)
                                        }}>
                                        <img className="icon-img" src={icons[type]} alt={type} />
                                    </div>
                                )
                            })}
                    </CategoryArea>
                </div>
            </div>
        )
    }

}

export default IconEditBox