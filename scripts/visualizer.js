class Visualizer {

    static drawNetwork(ctx, network) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = ctx.canvas.width - 2 * margin; // both left right margins
        const height = ctx.canvas.height - 2 * margin; // top bottom margins

        const levelHeight = height / network.levels.length;

        for (let i = 0; i < network.levels.length; i++) {
            const lvlTop = top + lerp(height - levelHeight, 0, network.levels.length === 1 ? 0.5 : i / (network.levels.length - 1));
            ctx.setLineDash([7,3]);
            Visualizer.drawLevel(ctx, network.levels[i], left, lvlTop, width, levelHeight, i===network.levels.length-1 ? ['↑', '←', '→', '↓'] :[]);
            
        }
    }

    static drawLevel(ctx, level, left, top, width, height,outputLabels) {
        const right = left + width;
        const bottom = top + height;
        const { inputs, outputs, weights, biases } = level;
        const nodeRadius = 16;

        // connecting i/p o/p with lines
        for (let i = 0; i < inputs.length; i++) {
            for (let j = 0; j < outputs.length; j++) {
                ctx.beginPath();
                ctx.moveTo(
                    Visualizer.#getNodeX(inputs, i, left, right),
                    bottom
                );
                ctx.lineTo(
                    Visualizer.#getNodeX(outputs, j, left, right),
                    top
                );
                ctx.lineWidth = 2;
                ctx.strokeStyle = getRGBA(weights[i][j]);
                ctx.stroke();
            }
        }

        // drawing the nodes for input layer
        for (let i = 0; i < inputs.length; i++) {
            const x = Visualizer.#getNodeX(inputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, bottom, nodeRadius * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(inputs[i]);
            ctx.fill();
        }
        // drawing nodes for output layer
        for (let i = 0; i < outputs.length; i++) {
            const x = Visualizer.#getNodeX(outputs, i, left, right);
            ctx.beginPath();
            ctx.arc(x, top, nodeRadius * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = getRGBA(outputs[i]);
            ctx.fill();

            // implement bias in ui
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
            ctx.strokeStyle = getRGBA(biases[i]);
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]);

            // labelling o/p nodes acc to visualize action triggered
            if(outputLabels[i]){
                ctx.beginPath();
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillStyle = "black";
                ctx.strokeStyle = "orange";
                ctx.font = (nodeRadius*0.8)+"px Arial";
                ctx.fillText(outputLabels[i],x,top);
                ctx.lineWidth = 1;
                ctx.strokeText(outputLabels[i],x,top);
            }
        }
    }

    // helper for getting x position of node
    static #getNodeX(nodes, index, left, right) {
        return lerp(
            left,
            right,
            nodes.length === 1 ? 0.5 : index / (nodes.length - 1)
        );
    }

}