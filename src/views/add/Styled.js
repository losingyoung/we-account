import Styled from "styled-components";

const Blue = "#108ee9"
export const CategoryArea = Styled.div`
    background:#fff;
    min-height:44px;
    display:flex;
    flex-wrap:wrap;
    padding:0 7px;
    .cate-item-wrapper{
        padding-bottom:9px;
        border:solid #fff 1px;
        border-radius:5px;
        position:relative;
        &.active{
            border-color:black;
            box-shadow: 0px 0px 5px inset;
            color: ${Blue};
        }
        &.edit-setting-icon{
            padding:9px;
        }
        .icon-title-wrapper{
            width:${props => props.iconWidth ? props.iconWidth + 18 : 48}px;
        }
        .edit-icon{
            position: relative;
            height:12px;
            svg{
                height:12px;
                width:12px;
            }
        }
        .del-icon{
            position:absolute;
            top:0px;
            right:0px;
            height:12px;
        }
        .icon-img{
            margin:9px;
            margin-bottom:0;
        }
        .icon-img, >svg{
            width:${props => props.iconWidth ? props.iconWidth : 30}px;
        }
        svg{
            color: ${Blue};
            height:100%;
        }
    }
`

