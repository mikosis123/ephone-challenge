import React, { useCallback, useRef, useState } from "react";
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
  ReactFlowProps,
} from "reactflow";
import "reactflow/dist/style.css";
import Sidebar from "./components/Sidebar";
import CustomNode from "./components/CustomNode";
import { initialNodes, initialEdgesfinal } from "./components/Nodeedge";
import Nav from "./components/Nav";
import { Button, TextField } from "@mui/material";

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

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgesfinal);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [nodeLabel, setNodeLabel] = useState("");

  const [menu, setMenu] = useState(null);
  const ref = useRef(null);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      console.log("node", node);
    },
    [setSelectedNode]
  );
  const onPaneClick = useCallback(() => {
    setSelectedNode(null); // Deselect node when clicking on the pane background
  }, []);
  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  const duplicateNode = useCallback(() => {
    if (selectedNode && "position" in selectedNode) {
      // Check if selectedNode has position
      const newNode: ExtendedNode = {
        ...selectedNode,
        id: `node-${Math.random().toString(36).substr(2, 9)}`, // generate a unique ID
        position: {
          x: selectedNode.position.x + 100, // adjust x position slightly for visibility
          y: selectedNode.position.y + 10, // adjust y position slightly for visibility
        },
        data: {
          label: selectedNode.data.label, // ensure data is copied, adjust accordingly if needed
        },
      };
      setNodes((nds) => [...nds, newNode]);
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
  const createEdgesFromNodes = (nodeList: Node[]) => {
    return nodeList
      .map((node, index) => {
        if (index < nodeList.length - 1) {
          return {
            id: `e${node.id}-${nodeList[index + 1].id}`,
            source: node.id,
            target: nodeList[index + 1].id,
            type: "smoothstep", // Ensures edges have smooth curves
            animated: true, // Makes the edge animated
            style: { stroke: "#3730a3", strokeWidth: 1 }, // Custom stroke color and width
            arrowHeadType: "arrowclosed", // Adds an arrow head at the end of the edge
          };
        }
        return null;
      })
      .filter(isNotNull); // Filters out any null values
  };

  const handleMenuItemsChange = (items: MenuItem[]) => {
    const newNodes = createNodesFromMenuItems(items);
    const newEdges = createEdgesFromNodes(newNodes);

    setNodes(newNodes);
    setEdges(newEdges);
  };

  const handleLabelChange = (event: any) => {
    setNodeLabel(event.target.value);
  };

  const saveNodeData = () => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === selectedNode.id) {
            return {
              ...node,
              data: { ...node.data, label: nodeLabel },
            };
          }
          return node;
        })
      );
      setSelectedNode(null); // Optionally clear selection after edit
    }
  };
  const getRandomInt = (max: any) => Math.floor(Math.random() * max);

  const createRandomNode = () => {
    const id = `random-node-${getRandomInt(1000)}`; // Ensure unique ID
    return {
      id,
      type: "customNode", // or 'default' if you don't need custom styling
      position: { x: getRandomInt(200), y: getRandomInt(200) }, // Random position within some bounds
      data: { label: `Node ${getRandomInt(100)}` },
    };
  };

  const addRandomNode = () => {
    const newNode = createRandomNode();
    setNodes((nds) => [...nds, newNode]);

    const lastNode = nodes[nodes.length - 1]; // Get the last node
    if (lastNode) {
      const newEdge = {
        id: `e${lastNode.id}-${newNode.id}`,
        source: lastNode.id,
        target: newNode.id,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#3730a3", strokeWidth: 2 },
        arrowHeadType: "arrowclosed",
      };
      setEdges((eds) => [...eds, newEdge]);
    }
  };

  return (
    <div>
      <Nav />
      <div
        className="flex justify-content-between align-items-center bg-light"
        style={{ width: "100vw", height: "100vh" }}
      >
        <Sidebar onMenuItemsChange={handleMenuItemsChange} />
        <div
          className="p-2 border border-dark"
          style={{ width: "100vw", height: "80vh" }}
        >
          <div className="flex gap-4">
            <Button
              className="mr-8"
              onClick={addRandomNode}
              variant="contained"
            >
              Add Random Node
            </Button>

            <Button className="m-2" onClick={duplicateNode} variant="contained">
              duplicate by node point
            </Button>
            <div className="">
              {selectedNode && (
                <div className="ml-auto">
                  <TextField
                    label="Edit Node Label"
                    variant="outlined"
                    value={nodeLabel}
                    onChange={handleLabelChange}
                    size="small"
                  />
                  <Button
                    onClick={saveNodeData}
                    color="primary"
                    variant="contained"
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
          >
            <MiniMap />
            <Controls />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
