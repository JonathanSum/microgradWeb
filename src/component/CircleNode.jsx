import { Handle } from "@xyflow/react";
import React, { memo } from "react";



const CircleNode = (({ data, isConnectable }) => {
    return (
        <div
            style={{
                width: "45px",
                height: "45px",
                border: "2px solid black",
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}
        >
            <Handle
                type="target"
                position="left"
                style={{ background: "#555" }}
                onConnect={(params) => console.log("handle onConnect", params)}
                isConnectable={isConnectable}
            />
            <div>{data.label}</div>
            <Handle
                type="source"
                position="right"
                id="a"
                style={{ background: "#555" }}
                isConnectable={isConnectable}
            />
        </div>
    );
});


export default CircleNode
