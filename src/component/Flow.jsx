import React, { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant
} from '@xyflow/react';
import dagre from 'dagre';

import { initialNodes, initialEdges } from './nodes-edges';

import '@xyflow/react/dist/style.css';
import CircleNode from './CircleNode';



const nodeTypes = {
  opNode: CircleNode,
};

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 100;
const nodeHeight = 5;

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);
  let step = 0.5
  let stepx = 1
  let tempDx = 0
  let tempDy = 0
  let tempStep = 50
  const newNodes = nodes.map((node) => {
    stepx += 1
    const nodeWithPosition = dagreGraph.node(node.id);


    const newNode = {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
    if (node.type === "input") {
      // newNode.position.x = newNode.position.x - 1000
      // newNode.position.y = newNode.position.y
      newNode.position.x = -1200
      newNode.position.y = 900 * step
      step += 1
    }

    else if (node.type === 'default') {
      // // // if (tempDx == -1 || tempDy == -1) {
      // //   tempDx = 0 + tempStep
      // //   tempDy = 0 + tempStep
      // //   tempStep += 50
      // // // }
      // newNode.position.y = tempDy - 500
      // newNode.position.x = tempDx + tempStep
      // tempStep += 200
      newNode.position.x = newNode.position.x - 250
      newNode.position.y = newNode.position.y - 2000
    }

    return newNode;
  });

  return { nodes: newNodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges,
);
const defaultViewport = { x: 1000, y: 1500, zoom: 50 };
const Flow = ({ data }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds,
        ),
      ),
    [],
  );
  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } =
        // getLayoutedElements(nodes, edges, direction);
        getLayoutedElements(nodes, edges, direction);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges],
  );

  useEffect(() => {
    // console.log("4------------")
    // console.log(data)

    if (data !== null) {
      const { nodes: layoutedNodesC, edges: layoutedEdgesC } = getLayoutedElements(
        data.node,
        data.edge,
      );
      setNodes(layoutedNodesC);
      setEdges(layoutedEdgesC);
      setViewport({ x: 400, y: 200, zoom: 0.1 }, { duration: 800 });
    }

  }, [data])
  const { setViewport, zoomIn, zoomOut } = useReactFlow();
  const handleTransform = useCallback(() => {
    setViewport({ x: -2000, y: -2000, zoom: 1 }, { duration: 800 });
  }, [setViewport]);

  return (

    <ReactFlow
      minZoom={0.01}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      connectionLineType={ConnectionLineType.SmoothStep}
    >
      <Panel position="top-right">
        <button onClick={() => zoomIn({ duration: 800 })}>zoom in</button>
        <button onClick={() => zoomOut({ duration: 800 })}>zoom out</button>
        <button onClick={handleTransform}>pan to center</button>
      </Panel>

      <Background color="#ccc" />
    </ReactFlow>

  );
};
export default ({ data }) => (
  <ReactFlowProvider >
    <Flow data={data} />
  </ReactFlowProvider>
);

// export default Flow;
