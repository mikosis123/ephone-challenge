import React, { useCallback } from "react";
import { useReactFlow, Node } from "reactflow";

// Define an interface for the props
interface ContextMenuProps {
  id: string;
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  [key: string]: any; // for additional props spread
}

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: ContextMenuProps) {
  const { getNode, addNodes, setNodes, setEdges } = useReactFlow();

  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    if (!node) return;

    const newNode: Node = {
      ...node,
      selected: false,
      dragging: false,
      id: `${node.id}-copy`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
    };

    addNodes(newNode);
  }, [id, getNode, addNodes]);

  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== id || edge.target !== id)
    );
  }, [id, setNodes, setEdges]);

  // Styling object for the container
  const style: React.CSSProperties = { top, left, right, bottom };

  return (
    <div style={style} className="context-menu" {...props}>
      <p style={{ margin: "0.5em" }}>
        <small>node: {id}</small>
      </p>
      <button onClick={duplicateNode}>Duplicate</button>
      <button onClick={deleteNode}>Delete</button>
    </div>
  );
}
