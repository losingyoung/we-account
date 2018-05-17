import React from 'react'
import Styled from 'styled-components'

import ICONS from "../../add/icon";
const Blue = "#108ee9"
const AccountItemContainer = Styled.div`
        width:100%;
        background-color:#fff;
        min-height:50px;
        margin-bottom:10px;
        padding:10px;
        padding-right:5px;
        text-align:left;
    `
    const DataRow = Styled.div`
       display:flex;
       justify-content:space-between;
       align-items:center;
    `
    const LeftData = Styled.div`
       text-align:left;
    `
    const CategoryIcon = Styled.img`
       height:20px;
       width:20px;
    `
    const CategoryContainer = Styled.div`
       font-size:16px;
    `
    const RightData = Styled.div`
       text-align:right;
       .del-icon{
           padding:5px;
           color: ${Blue};
           /* margin-left:5px; */
       }
    `
    const Price = Styled.span`
       font-size:16px;
    `
    const DescRow = Styled.div`
       min-height:20px;
       color: #999;
    `
function AccountItem(props) {
    
    const categoryIcon = ICONS[props.CategoryType]
    return (
        <AccountItemContainer>
            <DataRow>
                <LeftData>
                    <div>
                        <span>{props.dateStr}</span>
                    </div>
                    <CategoryContainer>
                        {categoryIcon && <span><CategoryIcon src={ICONS[props.CategoryType]} /></span>}
                        <span>{props.categoryName}</span>
                    </CategoryContainer>
                </LeftData>
                {props.group_id && <div>{props.userName}</div>}
                <RightData>
                    {/* <span>收入 支出</span> */}
                    <Price>¥{props.price}</Price>
                    <span
                        className="del-icon"
                        onClick={(e) => {
                            props.onDel&&props.onDel(props)
                        }}><i className="fa fa-trash-alt" /></span>
                </RightData>
            </DataRow>
            <DescRow>
                <div>
                    {props.description}
                </div>
            </DescRow>
        </AccountItemContainer>
    )
}
export default AccountItem