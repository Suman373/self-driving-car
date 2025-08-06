class ANN { 
    constructor(neuronCounts){
        this.levels = [];
        for(let i=0;i<neuronCounts.length-1;i++){
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i+1]
            ));
        }
    }
    
    static feedForward(givenInputs,network){
        let outputs = Level.feedForward(givenInputs, network.levels[0]);// generate outputs from 1st level (also the input level)
        for(let i=1;i<network.levels.length;i++){
            outputs = Level.feedForward(outputs, network.levels[i]);
        }
        return outputs;
    }

    // mutates the network by changing the biases and weights
    static mutate(network, amount=1){
        network.levels.forEach((level)=> {
            for(let i=0;i<level.biases.length;i++){
                level.biases[i] = lerp(
                    level.biases[i],
                    Math.random()*2-1, // [-1,1]
                    amount // shift bias towards the random value by param amount
                )
            }

            for(let i=0;i<level.weights.length;i++){
                for(let j=0;j<level.weights[i].length;j++){
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }
        });
    }
}


class Level {

    constructor(inputCount, outputCount) {

        this.inputs = new Array(inputCount); // create inputs
        this.outputs = new Array(outputCount); // ""  
        this.biases = new Array(outputCount); // bias associated with output - threshold for firing an output
        this.weights = []; // every input has output times weights

        for (let i = 0; i < this.inputs.length; i++) {
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this);
    }

    static #randomize(level) {
        // weight is randomized between [-1,1], for positive and negative action for the car
        for (let i = 0; i < level.inputs.length; i++) {
            for (let j = 0; j < level.outputs.length; j++) {
                level.weights[i][j] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < level.biases.length; i++) {
            level.biases[i] = Math.random() * 2 - 1;
        }
    }

    // feedforward algorithm to check if the summation of input * weight is greater than bias, if so, it will trigger that output node
    static feedForward(givenInputs, level) {
        // feed new inputs to the level inputs
        for (let i = 0; i < level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i = 0; i < level.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i]; // consider weight of ith output for jth input
            }
            if(sum > level.biases[i]){
                level.outputs[i] = 1; // fired
            }else {
                level.outputs[i] = 0;
            }
        }

        return level.outputs;
    }
}