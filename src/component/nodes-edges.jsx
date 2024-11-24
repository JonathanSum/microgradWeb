import { MarkerType } from '@xyflow/react';

const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';

export const initialNodes = [
    {
        id: '1',
        // type: 'input',
        data: { label: 'input' },
        position,
    },
    {
        id: '2',
        data: { label: 'node 2' },
        position,
    },
    {
        id: '2a',
        data: { label: 'node 2a' },
        position,
    },
    {
        id: '2b',
        data: { label: 'node 2b' },
        position,
    },
    {
        id: '2c',
        data: { label: 'node 2c' },
        position,
    },
    {
        id: '2d',
        data: { label: 'node 2d' },
        position,
    },
    {
        id: '3',
        data: { label: 'node 3' },
        position,
    },
    {
        id: '4',
        data: { label: 'node 4' },
        position,
    },
    {
        id: '5',
        data: { label: 'node 5' },
        position,
    },
    {
        id: '6',
        type: 'output',
        data: { label: 'output' },
        position,
    },
    { id: '7', type: 'output', data: { label: 'output' }, position },
]
export const marker = {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
    color: 'black',
}
export const initialEdges = [
    {
        id: 'e12', source: '1', target: '2', type: edgeType, markerEnd: marker, animated: true,
        style: {
            strokeWidth: 2,
            stroke: '#FF0072',
        },
    },
    {
        id: 'e13', source: '1', target: '3', type: edgeType, marker, animated: true
    },
    {
        id: 'e22a', source: '2', target: '2a', type: edgeType, markerEnd: marker, animated: true
    },
    {
        id: 'e22b', source: '2', target: '2b', type: edgeType, markerEnd: {
            type: MarkerType.Arrow,
        }, animated: true
    },
    {
        id: 'e22c', source: '2', target: '2c', type: edgeType, markerEnd: {
            type: MarkerType.Arrow,
        }, animated: true,
    },
    {
        id: 'e2c2d', source: '2c', target: '2d', type: edgeType,
        markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "pink",
        },
        animated: true
    },
    {
        id: 'e45', source: '4', target: '5', type: edgeType, markerEnd: {
            type: MarkerType.Arrow,
        }, animated: true
    },
    {
        id: 'e56', source: '5', target: '6', type: edgeType, markerEnd: {
            type: MarkerType.Arrow,
        }, animated: true
    },
    {
        id: 'e57', source: '5', target: '7', type: edgeType, markerEnd: {
            type: MarkerType.Arrow,
        }, animated: true
    },
];
