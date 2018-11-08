//Basic Neural Network system. Kinda sorta hopefully works.

class NeuralNet {

    constructor(inputs, hiddens, outputs) {

        this.inputs = inputs;
        this.hiddens = hiddens;
        this.outputs = outputs;

        this.hiddensInputs = new Matrix(hiddens, inputs + 1);
        this.hiddenshiddens = new Matrix(hiddens, hiddens + 1);
        this.hiddensOutputs = new Matrix(outputs, hiddens + 1);

        this.hiddensInputs.randomise();
        this.hiddenshiddens.randomise();
        this.hiddensOutputs.randomise();

    }

    mutate(muteRate) {
        this.hiddensInputs.mutate(muteRate);
        this.hiddenshiddens.mutate(muteRate);
        this.hiddensOutputs.mutate(muteRate);
    }


    output(inputArr) {
                
        let inputs = (this.hiddensOutputs.singleColumnMatrix(inputArr));

        let Biased = inputs.Bias();

        let WeightedHiddenInputs = this.hiddensInputs.dot(Biased);

        let WeightedHiddenOutputs = WeightedHiddenInputs.activate();

        let WeightedHiddenOutputsBias = WeightedHiddenOutputs.Bias();

        let HI2 = this.hiddenshiddens.dot(WeightedHiddenOutputsBias);

        let HO2 = HI2.activate();
        let HOB2 = HO2.Bias();



        let OutIn = this.hiddensOutputs.dot(HOB2);

        let Out = OutIn.activate();

        return Out.toArray();

    }

    crossover(mate) {

        let child = new NeuralNet(this.inputs, this.hiddens, this.outputs);

        child.hiddensInputs = this.hiddensInputs.crossover(mate.hiddensInputs);
        child.hiddenshiddens = this.hiddenshiddens.crossover(mate.hiddenshiddens);
        child.hiddensOutputs = this.hiddensOutputs.crossover(mate.hiddensOutputs);

    }

    clone() {
        
        let clone = new NeuralNet(this.inputs, this.hiddens, this.outputs);
        
        clone.hiddensInputs = this.hiddensInputs.clone();
        clone.hiddenshiddens = this.hiddenshiddens.clone();
        clone.hiddensOutputs = this.hiddensOutputs.clone();
    }

}
