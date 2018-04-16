import React from "react";
export default function Title(props) {
    return (
        <div
            onClick={props.onClick}
            style={{
                padding: "5px 15px",
                display: "flex",
                "alignItems": "center"
            }}>
            <div style={{
                "marginRight": "5px"
            }}>{props.extra}</div>
            {props.children}
        </div>
    )
}