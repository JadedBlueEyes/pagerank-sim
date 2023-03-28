import Graph from "graphology";
import Sigma from "sigma";
import chroma from "chroma-js";
import ForceSupervisor from "graphology-layout-force/worker";
import Controls from "./Controls.svelte";
import { rankEdges, rankNodes } from "./rank";

const exampleGraph = {
  a: ["b"],
  b: ["c", "g"],
  c: ["d"],
  d: ["e", "b"],
  e: ["a", "b"],
  f: ["a", "c", "e"],
  g: []
}

const graph = new Graph({ multi: true });

let nodeLabelmap = {}
// add nodes
let i = -Object.keys(exampleGraph).length / 2
for (let node in exampleGraph) {
  let id = Math.random()
  nodeLabelmap[node] = id
  graph.addNode(id, {
    size: 1 * 25,
    label: node,
    x: i * 10,
    y: Math.random(),
    color: chroma.random().darken(1).hex(),
    score: 1
  });
  i += 1
}

// add edges
for (let node in exampleGraph) {
  for (let edge in exampleGraph[node]) {
    graph.addEdge(nodeLabelmap[node], nodeLabelmap[exampleGraph[node][edge]], {
      type: "arrow",
      color: "#333"
    });
  }
}
import { updating } from "./updating";

let continueUpdate = true

updating.subscribe((value) => {
  continueUpdate = value
  if (value) {
    updateGraph()
  }
})

function updateGraph () {
  rankEdges(graph)
  rankNodes(graph)
  if (continueUpdate) {
    requestAnimationFrame(updateGraph)
  }
}

requestAnimationFrame(updateGraph)


let controls = new Controls({
  target: document.getElementById("controls"),
  props: {
    graph: graph
  }
})

const container = document.getElementById("sigma-container");

// Create the spring layout and start it
const layout = new ForceSupervisor(graph, {
  isNodeFixed: (_, attr) => attr.highlighted,
});
layout.start();

// Create the sigma
const renderer = new Sigma(graph, container);




/**
 * Drag & drop
 */

// State for drag'n'drop
let draggedNode = null;
let isDragging = false;

// On mouse down on a node
//  - we enable the drag mode
//  - save in the dragged node in the state
//  - highlight the node
//  - disable the camera so its state is not updated
renderer.on("downNode", (e) => {
  isDragging = true;
  draggedNode = e.node;
  graph.setNodeAttribute(draggedNode, "highlighted", true);
});

// On mouse move, if the drag mode is enabled, we change the position of the draggedNode
renderer.getMouseCaptor().on("mousemovebody", (e) => {
  if (!isDragging || !draggedNode) return;

  // Get new position of node
  const pos = renderer.viewportToGraph(e);

  graph.setNodeAttribute(draggedNode, "x", pos.x);
  graph.setNodeAttribute(draggedNode, "y", pos.y);

  // Prevent sigma to move camera:
  e.preventSigmaDefault();
  e.original.preventDefault();
  e.original.stopPropagation();
});

// On mouse up, we reset the autoscale and the dragging mode
renderer.getMouseCaptor().on("mouseup", () => {
  if (draggedNode) {
    graph.removeNodeAttribute(draggedNode, "highlighted");
  }
  isDragging = false;
  draggedNode = null;
});
