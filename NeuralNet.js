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


    output() {

    }

    crossover() {

    }

    clone() {

    }

}
