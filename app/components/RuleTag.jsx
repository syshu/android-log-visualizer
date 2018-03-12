import React from "react"
import {Badge, Tag} from "antd"
const CheckableTag = Tag.CheckableTag

export default function ({ title, status, onChange, checked }) {
    return (
        <span>
            <CheckableTag
                checked={checked}
                onChange={onChange}
            >
                <Badge status={status}/>
                {title}
            </CheckableTag>
        </span>
    )
}