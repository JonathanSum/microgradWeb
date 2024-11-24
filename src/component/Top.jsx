import React, { useEffect, useState } from 'react'
import Canvas from './canvas/Canvas'
import { crossEntropy, MLP, Value } from './micrograd'

import Flow from './Flow';
import { marker } from './nodes-edges';




const trace = (root) => {

    const nodes = new Set(); const edges = new Set()
    const build = (v) => {
        if (!nodes.has(v)) {
            nodes.add(v)

            for (const child of v._prev) {
                edges.add([child, v])
                build(child)
            }
        }
    }
    build(root)
    return { nodes: nodes, edges: edges }
}
const objIdMap = new WeakMap; let objectCount = 0;
function id(object) {
    if (!objIdMap.has(object)) objIdMap.set(object, ++objectCount);
    return objIdMap.get(object);
}
const edgeType = 'straight';

const Top = () => {
    const groupId = { para: '301', in: '302', inter: '303', loss: '304' }
    const position = { x: 0, y: 0 };
    const [data, setData] = useState(null);

    const draw_dot = (root) => {

        const dot = { node: [], edge: [] }
        // dot.node.push({
        //     id: groupId.para,
        //     data: { label: 'parameter node' },
        //     position: { x: 0, y: 0 },
        //     className: 'light',
        //     style: {
        //         backgroundColor: 'rgba(255, 0, 0, 0.2)',
        //         height: 200,
        //         width: 200,
        //     },

        // },
        //     {
        //         id: groupId.in,
        //         data: { label: 'input nodes' },
        //         position: { x: 0, y: 0 },
        //         className: 'light',
        //         style: {
        //             backgroundColor: 'rgba(0, 255, 0, 0.2)',
        //             height: 200,
        //             width: 200,
        //         },
        //     },
        //     {
        //         id: groupId.inter,
        //         data: { label: 'the intermediate graph nodes' },
        //         position: { x: 0, y: 0 },
        //         className: 'light',
        //         style: {
        //             backgroundColor: 'rgba(0, 0, 255, 0.2)',
        //             height: 200,
        //             width: 200,
        //         },
        //     },
        //     {
        //         id: groupId.loss,
        //         data: { label: 'loss' },
        //         position: { x: 0, y: 0 },
        //         className: 'light',
        //         style: {
        //             backgroundColor: 'rgba(255, 0, 255, 0.2)',
        //             height: 200,
        //             width: 200,
        //         },
        //     },)
        const { nodes, edges } = trace(root)

        const NodeInfo = {
            trainable: {
                type: 'default',

                style: {
                    backgroundColor: "#90EE90",
                    color: "black",
                    border: '3px solid black',
                    height: 67,
                    width: 120,
                }

            },
            input: {
                type: 'input',
                style: {
                    backgroundColor: "#ADD8E6", color: "black",
                    border: "3px solid black",
                    height: 67,
                    width: 120,
                }

            }

        }

        for (const n of nodes) {
            const uid = id(n).toString()
            // console.log("debug here")
            // console.log(nodes)
            let styleTheNode = {}

            let NodeType = ""
            let parentId = ""
            if (n.label === 'weight' || n.label === 'bias') {
                styleTheNode = NodeInfo.trainable.style
                NodeType = NodeInfo.trainable.type
                parentId = groupId.para
            } else if (n.label === 'input') {

                styleTheNode = NodeInfo.input.style
                NodeType = NodeInfo.input.type
                parentId = groupId.in
            } else {
                styleTheNode = {
                    backgroundColor: "white", color: "black",
                    border: "3px solid black",
                    height: 67,
                    width: 120,
                }
            }



            //old one                 
            //data: { label: `${n.label} | data ${n.data.toFixed(2)} | grad ${n.grad.toFixed(2)}` },
            dot.node.push({
                id: uid,
                data: { label: `${n.label} | data ${n.data.toFixed(2)} | grad ${n.grad.toFixed(2)}` },
                // data: { label: `data: ${n.data.toFixed(5)} grad: ${n.grad.toFixed(5)}` },
                position,

                // A place signal to tell the React Flow that this there is a weight and bias Node.
                type: NodeType,

                style: styleTheNode,
                parentId: parentId
            })
            if (n._op !== "") {
                dot.node.push({
                    id: uid + n._op,
                    data: { label: `${n._op}` },
                    type: "opNode",
                    position,
                })
                dot.edge.push({

                    id: uid + " " + n._op, source: uid + n._op,
                    target: uid, type: edgeType,
                    markerEnd: marker,
                    style: {
                        strokeWidth: 2,
                        stroke: 'black',
                    },
                })
            }
        }
        for (const n of edges) {
            // const uid = id(n).toString()

            const to_n = id(n[1]).toString() + n[1]._op
            // console.log(to_n)
            dot.edge.push({
                id: id(n[0]).toString() + "to" + id(n[1]).toString() + " " + n[1]._op, source: id(n[0]).toString(),
                target: to_n, type: edgeType,
                markerEnd: marker,
                style: {
                    strokeWidth: 2,
                    stroke: 'black',
                },
            })
        }
        console.log(dot.node.length)

        return dot

    }


    useEffect(() => {
        const model = new MLP(2, [8, 3]);
        // console.log("yea");

        const x = [1, 2]
        const y = [2]
        const x1 = new Value(x[0]); const x2 = new Value(x[1])
        x1.setLabel("input"); x2.setLabel("input")
        const logits = model.forward([x1, x2])
        const loss = crossEntropy(logits, y);
        loss.backward();
        // const { nodes, edges } = trace(loss)
        loss.setLabel('loss')
        // console.log("1-------------")
        // console.log(nodes)
        // console.log("2-------------")
        // console.log(edges)
        const o1 = draw_dot(loss)
        setData(o1)

        // let a = new Value(2);
        // console.log(a)
        // let b = new Value(-3);
        // let c = new Value(10);

        // let e = a.mul(b)


        // let d = e.add(c)


        // let f = new Value(-2);

        // //this block is the course example
        // let L = d.mul(f)
        // a.setLabel('a');
        // b.setLabel('b');
        // c.setLabel('c');
        // d.setLabel('d');
        // e.setLabel('e');
        // f.setLabel('f');
        // L.setLabel('L');
        // L.backward();
        // console.log(e)
        // const o1 = draw_dot(L)
        // // setData(o1)
        // console.log("3-------------")
        // console.log(o1)
        // setData(o1)
        // console.log(data)
        //this block above is the course example
    }, []);



    return (
        <>

            <Flow data={data} />
        </>

    )
}


// const Top = () => {
//     const draw = (context, count) => {
//         context.clearRect(0, 0, context.canvas.width, context.canvas.height)
//         context.fillStyle = 'grey'
//         const d = count % 800  //so that the count stay between 0 to 800
//         context.fillRect(10 + d, 10, 100, 100)
//     }
//     const draw2 = (context, count) => {
//         context.clearRect(0, 0, context.canvas.width, context.canvas.height)
//         context.fillStyle = 'red'
//         const d = count % 100
//         context.fillRect(10 + d, 10, 10, 10)
//     }
//     return (
//         <>
//             <Canvas draw={draw} width="800" height="800" style={{ border: '1px solid black' }} />
//             <Canvas draw={draw2} width="100" height="100" style={{ border: '1px solid black' }} />
//         </>

//     )
// }




export default Top