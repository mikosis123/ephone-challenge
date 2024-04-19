import React from "react";
import { EdgeProps, getBezierPath } from "reactflow";

const MindMapEdge: React.FC<EdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
}) => {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });
  return (
    <path
      fill="none"
      stroke="#222"
      strokeWidth={2}
      className="animated"
      d={edgePath}
    />
  );
};

export default MindMapEdge;
