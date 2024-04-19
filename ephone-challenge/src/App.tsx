import React, { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import Sidebar from "./components/Sidebar";
import CustomNode from "./components/CustomNode";

interface MenuItem {
  id: string;
  label: string;
}

const initialEdges: Edge[] = [];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const nodeTypes = {
    customNode: CustomNode,
  };

  const createNodesFromMenuItems = (items: MenuItem[]) => {
    return items.map((item, index) => ({
      id: `node-${item.id}`,
      type: "customNode",
      position: { x: 150 * index, y: 25 },
      data: { label: item.label },
    }));
  };

  // Type guard to check if a value is not null
  const isNotNull = <T,>(value: T | null): value is T => value !== null;

  const createEdgesFromNodes = (nodeList: any[]) => {
    return nodeList
      .map((node, index) => {
        if (index < nodeList.length - 1) {
          return {
            id: `e${node.id}-${nodeList[index + 1].id}`,
            source: node.id,
            target: nodeList[index + 1].id,
            animated: true,
          };
        }
        return null;
      })
      .filter(isNotNull); // Use the type guard to filter out null values
  };
  const deleteNodeById = useCallback(
    (nodeId: string) => {
      setNodes((currentNodes) =>
        currentNodes.filter((node) => node.id !== nodeId)
      );
      setEdges((currentEdges) =>
        currentEdges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        )
      );
    },
    [setNodes, setEdges]
  );

  const handleMenuItemsChange = (items: MenuItem[]) => {
    const newNodes = createNodesFromMenuItems(items);
    const newEdges = createEdgesFromNodes(newNodes);
    setNodes(newNodes);
    setEdges(newEdges);
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
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          // onClick={deleteNodeById}
        >
          <MiniMap />
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
