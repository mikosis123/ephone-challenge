import React, { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import Sidebar from "./components/Sidebar";
import CustomNode from "./components/CustomNode";

const initialEdges: any = [];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Define the custom node types here
  const nodeTypes = {
    customNode: CustomNode, // Use the type identifier as a string key
  };

  // Helper function to create nodes from menu items
  const createNodesFromMenuItems = (items: any) => {
    return items.map((item: any, index: any) => ({
      id: `node-${index}`,
      type: "customNode", // Specify the custom node type here
      position: { x: 150 * index, y: 25 }, // Adjust layout as needed
      data: { label: item },
    }));
  };

  // This function is passed to the child component and used to update the state
  const handleMenuItemsChange = (items: any) => {
    const newNodes = createNodesFromMenuItems(items);
    setNodes(newNodes); // Update the nodes state with the new nodes
  };

  return (
    <div
      className="flex justify-content-between align-items-center bg-light"
      style={{ width: "100vw", height: "100vh" }}
    >
      <Sidebar onMenuItemsChange={handleMenuItemsChange} />
      <div
        className="p-4 border border-dark"
        style={{ width: "70vw", height: "100vh" }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes} // Use the nodeTypes defined earlier
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        >
          <MiniMap />
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
