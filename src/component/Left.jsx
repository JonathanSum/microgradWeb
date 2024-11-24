import React from 'react'
import Canvas from './canvas/Canvas'
import { AdamW, crossEntropy, genDataYinYang, MLP, RNG, Value } from './micrograd'
import Demo from './Demo'


const draw = (context, count) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.fillStyle = 'grey'
    const d = count % 80  //so that the count stay between 0 to 800
    context.fillRect(10 + d, 10, 100, 100)
}
const draw2 = (context, count) => {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    context.fillStyle = 'red'
    const d = count % 100
    context.fillRect(10 + d, 10, 10, 10)

}



const draw3 = (ctx, count) => {
    // Create an instance of RNG with seed 42
    const random = new RNG(42);
    // Generate data using the genData function
    const dataSplits = genDataYinYang(random, 100);
    const trainSplit = dataSplits.train;
    const valSplit = dataSplits.validation;
    const testSplit = dataSplits.test;
    // init the model: 2D inputs, 8 neurons, 3 outputs (logits)
    const model = new MLP(2, [8, 3]);
    // optimize using AdamW
    const optimizer = new AdamW(model.parameters(), 1e-1, [0.9, 0.95], 1e-8, 1e-4);

    function lossFun(model, split) {
        // forward the network and the loss function on all training datapoints
        let loss = new Value(0);
        for (const [x, y] of split) {
            const logits = model.forward([new Value(x[0]), new Value(x[1])]);
            loss = loss.add(crossEntropy(logits, y));
        }
        loss = loss.mul(1.0 / split.length); // normalize the loss
        return loss;
    }

    function renderCanvas(minX = -2, minY = -2, maxX = 2, maxY = 2) {
        // first render the datapoints

        // Clear the canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Function to map data points to canvas coordinates
        function mapToCanvas(x, y) {
            const canvasX = (x - minX) * (ctx.canvas.width / (maxX - minX));
            const canvasY = (maxY - y) * (ctx.canvas.height / (maxY - minY));
            return [canvasX, canvasY];
        }

        // Render the current decision surface
        const stepSize = 0.1;
        const rectWidth = stepSize * ctx.canvas.width / (maxX - minX);
        const rectHeight = stepSize * ctx.canvas.height / (maxY - minY);
        for (let x = minX; x < maxX; x += stepSize) {
            for (let y = minY; y < maxY; y += stepSize) {
                const centerX = x + stepSize / 2;
                const centerY = y + stepSize / 2;
                const logits = model.forward([new Value(centerX), new Value(centerY)]);
                const exps = logits.map(logit => Math.exp(logit.data));
                const sumExps = exps.reduce((a, b) => a + b, 0);
                const probs = exps.map(exp => exp / sumExps);

                const r = Math.floor(probs[0] * 255);
                const g = Math.floor(probs[1] * 255);
                const b = Math.floor(probs[2] * 255);

                const [canvasX, canvasY] = mapToCanvas(x, y);
                const [canvasX2, canvasY2] = mapToCanvas(x + stepSize, y + stepSize);
                const width = canvasX2 - canvasX;
                const height = canvasY - canvasY2;
                const mutedR = Math.floor(r + (255 - r) * 0.5);
                const mutedG = Math.floor(g + (255 - g) * 0.5);
                const mutedB = Math.floor(b + (255 - b) * 0.5);
                ctx.fillStyle = `rgb(${mutedR},${mutedG},${mutedB})`;
                ctx.strokeStyle = `rgb(${mutedR},${mutedG},${mutedB})`;
                ctx.fillRect(canvasX, canvasY2, width, height);
                ctx.strokeRect(canvasX, canvasY2, width, height);
            }
        }

        // Render training data points
        for (const [x, y] of trainSplit) {
            const [canvasX, canvasY] = mapToCanvas(x[0], x[1]);
            ctx.fillStyle = y === 0 ? 'red' : y === 1 ? 'green' : 'blue';
            ctx.beginPath();
            ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }

        // Render the 0-level set of all individual neurons
        // const showLevelSets = document.getElementById('show-level-sets').checked;
        // if (showLevelSets) {
        for (const neuron of model.layers[0].neurons) {
            const w0 = neuron.w[0].data;
            const w1 = neuron.w[1].data;
            const b = neuron.b.data;
            const x1 = -2;
            const y1 = (-b - w0 * x1) / w1;
            const x2 = 2;
            const y2 = (-b - w0 * x2) / w1;
            const [canvasX1, canvasY1] = mapToCanvas(x1, y1);
            const [canvasX2, canvasY2] = mapToCanvas(x2, y2);
            ctx.strokeStyle = 'white';
            ctx.beginPath();
            ctx.moveTo(canvasX1, canvasY1);
            ctx.lineTo(canvasX2, canvasY2);
            ctx.stroke();
        }
        // }
    }

    // function renderOptimizerState(num_columns = 3) {
    //     const optimizerDiv = document.getElementById('optimizer-div');
    //     optimizerDiv.innerHTML = '';

    //     const parameters = model.parameters();
    //     const rows = Math.ceil(parameters.length / num_columns);

    //     for (let col = 0; col < num_columns; col++) {
    //         const table = document.createElement('table');
    //         table.innerHTML = '<tr><th>param</th><th>-m/sqrt(v)</th><th>grad</th><th>m</th><th>sqrt(v)</th></tr>';
    //         table.style.display = 'inline-block';
    //         table.style.marginRight = '10px';
    //         table.style.verticalAlign = 'top';

    //         for (let row = 0; row < rows; row++) {
    //             const index = col * rows + row;
    //             if (index >= parameters.length) break;

    //             const param = parameters[index];
    //             const sqrtV = Math.sqrt(param.v + 1e-8);
    //             const update = -param.m / sqrtV; // the -sign is because we update params with -=
    //             const tableRow = document.createElement('tr');
    //             tableRow.innerHTML = `
    //         <td style="color: ${param.data >= 0 ? '#45a049' : '#e06666'}">${param.data.toFixed(4)}</td>
    //         <td style="color: ${update >= 0 ? '#45a049' : '#e06666'}">${update.toFixed(4)}</td>
    //         <td style="color: ${param.grad >= 0 ? '#45a049' : '#e06666'}">${param.grad.toFixed(4)}</td>
    //         <td style="color: ${param.m >= 0 ? '#45a049' : '#e06666'}">${param.m.toFixed(4)}</td>
    //         <td style="color: ${sqrtV >= 0 ? '#45a049' : '#e06666'}">${sqrtV.toFixed(4)}</td>
    //     `;
    //             table.appendChild(tableRow);
    //         }

    //         optimizerDiv.appendChild(table);
    //     }
    // }

    let step = 0;
    function trainAndRenderStep() {
        if (step < 100) {
            // evaluate the validation split every few steps
            if (step % 10 === 0) {
                const valLoss = lossFun(model, valSplit);
                console.log(`step ${step + 1}, val loss ${valLoss.data.toFixed(6)}`);
            }
            // get the loss for the training split
            const trainLoss = lossFun(model, trainSplit);
            console.log(`step ${step + 1}, train loss ${trainLoss.data.toFixed(6)}`);

            // backward pass (deposit the gradients)
            trainLoss.backward();

            // render the current state
            renderCanvas();
            // renderOptimizerState();

            // update with AdamW
            optimizer.step();
            optimizer.zeroGrad();

            step++;
            setTimeout(trainAndRenderStep, 100);
        }
    }

    // // Add event listener for checkbox changes
    // document.getElementById('show-level-sets').addEventListener('change', () => {
    //     renderCanvas();
    // });

    trainAndRenderStep();
}












const Left = () => {

    return (

        <>
            <Demo />
            {/* 
            <Canvas draw={draw3} width="500" height="500" style={{ border: '1px solid black' }} /> */}
            {/* <Canvas draw={draw2} width="100" height="100" style={{ border: '1px solid black' }} /> */}
        </>
    )
}

export default Left