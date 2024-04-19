import React from "react";
import { Handle, Position } from "reactflow";

const CustomNode = ({ data }: any) => {
  return (
    <div
      style={{
        border: "1px solid black",
        padding: "10px",
        borderRadius: "8px",
        backgroundColor: "#ffffff",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ borderRadius: "4px" }}
      />
      <div
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#333",
          fontSize: "14px",
          marginBottom: "5px",
        }}
      >
        {data.label}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ borderRadius: "4px" }}
      />
    </div>
  );
};

export default CustomNode;
