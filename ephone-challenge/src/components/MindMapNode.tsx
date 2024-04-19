import React from "react";
import { Handle, NodeProps, Position } from "reactflow";

export type NodeData = {
  label: string;
};

const MindMapNode: React.FC<NodeProps<NodeData>> = ({ data, id }) => {
  return (
    <div className="react-flow__node-mindmap">
      <input defaultValue={data.label} />
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default MindMapNode;
