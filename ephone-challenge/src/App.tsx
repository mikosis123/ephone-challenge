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
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import Sidebar from "./components/Sidebar";
import CustomNode from "./components/CustomNode";

interface MenuItem {
  id: string;
  label: string;
}
interface ExtendedNode extends Node {
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
  };
}

const initialEdges: Edge[] = [];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNode(node);
  }, []);
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  const duplicateNode = useCallback(() => {
    if (selectedNode) {
      const newNode = {
        ...selectedNode,
        id: `node-${Math.random().toString(36).substr(2, 9)}`,
        position: {
          x: selectedNode.position.x + 100, // slightly offset x for visibility
          y: selectedNode.position.y + 10,
        },
      };
      setNodes((nds: any) => [...nds, newNode]);
    }
  }, [selectedNode, setNodes]);
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

  const handleMenuItemsChange = (items: MenuItem[]) => {
    const newNodes = createNodesFromMenuItems(items);
    const newEdges = createEdgesFromNodes(newNodes);
    setNodes(newNodes);
    setEdges(newEdges);
  };
  const getRandomInt = (max: any) => Math.floor(Math.random() * max);

  const createRandomNode = () => {
    const id = `random-node-${getRandomInt(1000)}`; // Ensure unique ID
    return {
      id,
      type: "customNode", // or 'default' if you don't need custom styling
      position: { x: getRandomInt(800), y: getRandomInt(600) }, // Random position within some bounds
      data: { label: `Node ${getRandomInt(100)}` },
    };
  };

  const addRandomNode = () => {
    const newNode = createRandomNode();
    setNodes((nds) => [...nds, newNode]);
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
        <button onClick={addRandomNode} style={{ marginBottom: "10px" }}>
          Add Random Node
        </button>
        <button onClick={duplicateNode} style={{ marginBottom: "10px" }}>
          duplicate node
        </button>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
        >
          <MiniMap />
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
