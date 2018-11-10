//Neural Network uses a set of 2D arrays in order to manipulate the vision array into the decision array. 

class NeuralNet {

    //----------------------------------------------------------------
    //Usage : Creates the initial network
    //Arg   : Inputs - First level matrix, hiddens - second level matrix, outputs - third level matrix
    //Return:
    //----------------------------------------------------------------
    constructor(inputs, hiddens, outputs) {

        this.inputs = inputs;
        this.hiddens = hiddens;
        this.outputs = outputs;

        //Creates a series of Matrices whose size is determined by the node counts above
        this.hiddensInputs = new Matrix(hiddens, inputs + 1);
        this.hiddenshiddens = new Matrix(hiddens, hiddens + 1);
        this.hiddensOutputs = new Matrix(outputs, hiddens + 1);


        //randomly populates each of the matrices with 1s and -1s
        this.hiddensInputs.randomise();
        this.hiddenshiddens.randomise();
        this.hiddensOutputs.randomise();

    }

    //----------------------------------------------------------------
    //Usage : uses the mutation tool to mix around the matrices
    //Arg   : muteRate - chance of mutation
    //Return:
    //----------------------------------------------------------------
    mutate(muteRate) {
        this.hiddensInputs.mutate(muteRate);
        this.hiddenshiddens.mutate(muteRate);
        this.hiddensOutputs.mutate(muteRate);
    }

    //----------------------------------------------------------------
    //Usage : Passes the vision array through all three matrices (and a few combinations of the matrices) to output decisions
    //Arg   : inputArr - the initial vision array at any frame
    //Return: decision learnt array
    //----------------------------------------------------------------
    output(inputArr) {

        let inputs = (this.hiddensOutputs.singleColumnMatrix(inputArr)); //turn the vision array into a 1xN Matrix
        let Biased = inputs.Bias(); //Applies a level of bias to the array to encourage acting

        let WeightedHiddenInputs = this.hiddensInputs.dot(inputs); //Runs the biased input matrix through the first matrix

        let WeightedHiddenOutputs = WeightedHiddenInputs.activate(); //Runs the 1 generation matrix through the sigmoid function (which represents learning curves)

        let WeightedHiddenOutputsBias = WeightedHiddenOutputs.Bias(); //Adds a level of bias to the 1 generation matrix to encourage acting

        let HI2 = this.hiddenshiddens.dot(WeightedHiddenOutputsBias); //Runs the 1 generation matrix through the second matrix 

        let HO2 = HI2.activate(); //Runs the 2 generation matrix through the sigmoid function learning curve
        let HOB2 = HO2.Bias(); //Adds a level of bias to the 2 generation matrix to encourage acting

        let OutIn = this.hiddensOutputs.dot(HOB2); // runs the 2 generation matrix through the third matrix

        let Out = OutIn.activate(); //runs the 3 generation matrix through the sigmoid learning curve

        return Out.toArray(); //outputs the 3 generation learning matrix to an array to be returned to the ship.
    }

    //----------------------------------------------------------------
    //Usage : Uses the matrix crossover tool to create a new Net Brain as a product of the current brain and its mate
    //Arg   : mate - the brain of the current ship's mate
    //Return: child - the new generation brain
    //----------------------------------------------------------------
    crossover(mate) {

        let child = new NeuralNet(this.inputs, this.hiddens, this.outputs);

        child.hiddensInputs = this.hiddensInputs.crossover(mate.hiddensInputs);
        child.hiddenshiddens = this.hiddenshiddens.crossover(mate.hiddenshiddens);
        child.hiddensOutputs = this.hiddensOutputs.crossover(mate.hiddensOutputs);

        return child;
    }

    //----------------------------------------------------------------
    //Usage : creates a copy of the original brain
    //Arg   : 
    //Return: a copy of this brain.
    //----------------------------------------------------------------
    clone() {

        let clone = new NeuralNet(this.inputs, this.hiddens, this.outputs);

        clone.hiddensInputs = this.hiddensInputs.clone();
        clone.hiddenshiddens = this.hiddenshiddens.clone();
        clone.hiddensOutputs = this.hiddensOutputs.clone();

        return clone;
    }
}
