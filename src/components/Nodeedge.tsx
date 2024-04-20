export const initialNodes = [
  { id: "1", position: { x: 175, y: 0 }, data: { label: "menu items" } },
  { id: "2", position: { x: 0, y: 250 }, data: { label: "a" } },
  { id: "3", position: { x: 175, y: 250 }, data: { label: "b" } },
  { id: "4", position: { x: 350, y: 250 }, data: { label: "c" } },
];

export const initialEdgesfinal = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
  },
  {
    id: "e1-4",
    source: "1",
    target: "4",
  },
];

export default { initialNodes, initialEdgesfinal };
