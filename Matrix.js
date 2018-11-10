//Matrix is a 2D array of 1s and -1s used to determine decisions

class Matrix {

    //----------------------------------------------------------------
    //Usage : Creates an empty 2D matrix
    //Arg   : rows - number of rows in the matrix, cols - number of cols in the matrix
    //Return:
    //----------------------------------------------------------------
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.matrix = [];

        for (let i = 0; i < rows; i++) {
            this.matrix.push([cols]);
        }
    }

    //----------------------------------------------------------------
    //Usage : copies the current matrix (size wise anyway)
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    constructorMat(matrix) {
        this.matrix = matrix;
        this.rows = matrix.length;
        this.cols = matrix[0].length;
    }

    //----------------------------------------------------------------
    //Usage : prints the contents of the matrix
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    output() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                console.log(this.matrix[i][j] + " ");
            }
        }
    }

    //----------------------------------------------------------------
    //Usage : multiply the matrix contents by a scalar
    //Arg   : n - scalar
    //Return:
    //----------------------------------------------------------------
    multiply(n) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] *= n;
            }
        }
    }

    //----------------------------------------------------------------
    //Usage : dots two matrices together to create a new matrix
    //Arg   : matrix to dot by
    //Return: dotted return matrix
    //----------------------------------------------------------------
    dot(matrix) {

        let result = new Matrix(this.rows, matrix.cols);

        if (this.cols == matrix.rows) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < matrix.cols; j++) {
                    let sum = 0;
                    for (let k = 0; k < this.cols; k++) {
                        sum += this.matrix[i][k] * matrix.matrix[k][j];
                    }
                    result.matrix[i][j] = sum;
                }
            }
        }
        return result;
    }

    //----------------------------------------------------------------
    //Usage : populates the array with 1s and -1s
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    randomise() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] = Math.random() < 0.5 ? -1 : 1;
            }
        }
    }

    //----------------------------------------------------------------
    //Usage : Adds a scalar to the matrix contents
    //Arg   : n - scalar to add by
    //Return:
    //----------------------------------------------------------------
    add(n) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] += n;
            }
        }
    }

    //----------------------------------------------------------------
    //Usage : Adds two matrices together
    //Arg   : matrix - matrix to add to the current matrix
    //Return:
    //----------------------------------------------------------------
    addMatrix(matrix) {

        let newMat = new Matrix(this.rows, this.cols);

        if (this.matrix.rows == matrix.rows && this.matrix.cols == matrix.cols) { //only works on matrices that are the same size

            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    newMat.matrix[i][j] = this.matrix[i][j] + matrix[i][j];
                }
            }
        }
        return newMat;
    }

    //----------------------------------------------------------------
    //Usage : subtracts a matrix from the current matrix
    //Arg   : matrix - the matrix to subtract by
    //Return:
    //----------------------------------------------------------------
    subtract(matrix) {

        let newMat = new Matrix(this.rows, this.cols);

        if (this.matrix.rows == matrix.rows && this.matrix.cols == matrix.cols) { //can only subtract from equal sized arrays

            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    newMat.matrix[i][j] = this.matrix[i][j] - matrix[i][j];
                }
            }
        }
        return newMat;
    }

    //----------------------------------------------------------------
    //Usage : Multiplies two matrices together
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    mult(matrix) {

        let newMat = new Matrix(this.rows, this.cols);

        if (this.matrix.rows == matrix.rows && this.matrix.cols == matrix.cols) {

            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    newMat.matrix[i][j] = this.matrix[i][j] * matrix[i][j];
                }
            }
        }
        return newMat;
    }

    //----------------------------------------------------------------
    //Usage : Returns the transpose of the matrix
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    transpose() {

        let newMat = new Matrix(this.cols, this.rows);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                newMat.matrix[j][i] = this.matrix[i][j];
            }
        }
        return newMat;
    }

    //----------------------------------------------------------------
    //Usage : turns the inputed array into a 1xN matrix
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    singleColumnMatrix(array) {

        let newMat = new Matrix(array.length, 1);
        for (let i = 0; i < array.length; i++) {
            newMat.matrix[i][0] = array[i];
        }
        return newMat;
    }

    //----------------------------------------------------------------
    //Usage : Creates a 2D matrix from an array
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    fromArray(array) {

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] = array[j + i * this.cols];
            }
        }
    }

    //----------------------------------------------------------------
    //Usage : Turns a 2D matrix into a 1xN array
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    toArray() {

        let array = [this.rows * this.cols];

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                array[j + i * this.cols] = this.matrix[i][j];
            }
        }
        return array;
    }

    //----------------------------------------------------------------
    //Usage : Creates a slightly larger Matrix that has a final row of all 1s. Used to encourage acting by increasing overall positive counts, increasing the chance of the decision array holding >0.8 values
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    Bias() {

        let newMat = new Matrix(this.rows + 1, 1);
        for (let i = 0; i < this.rows; i++) {
            newMat.matrix[i][0] = this.matrix[i][0];
        }
        newMat.matrix[this.rows][0] = 1;
        return newMat;

    }

    //----------------------------------------------------------------
    //Usage : Runs the Matrix through a sigmoid equation (representing learning curves)
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    activate() {

        let newMat = new Matrix(this.rows, this.cols);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                newMat.matrix[i][j] = this.sigmoid(this.matrix[i][j]);
            }
        }
        return newMat;
    }

    //Sigmoids, or S curves, are used in a lot of learning networks to approximate how learning works. From Wiki: a progression from small beginnings that accelerates and approaches a climax over time.
    sigmoid(x) {

        let y = 1 / (1 + Math.pow(parseFloat(Math.E), -x));

        return y;

    }


    sigmoidDerived() {

        let newMat = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                newMat.matrix[i][j] = (this.matrix[i][j] * (1 - this.matrix[i][j]));
            }
        }
        return newMat;
    }

    //----------------------------------------------------------------
    //Usage : Anti-Bias. This method removes the bottom row of the matrix to remove the bias level
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    removeBottom() {

        let newMat = new Matrix(this.rows - 1, this.cols);

        for (let i = 0; i < newMat.rows; i++) {
            for (let j = 0; j < this.rows; j++) {
                newMat.matrix[i][j] = this.matrix[i][j];
            }
        }

        return newMat;

    }

    //----------------------------------------------------------------
    //Usage : Mutates the matrix values. Fleshes out the matrices to -1 to 1 instead of just -1 or 1. 
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    mutate(muteChance) {

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.rows; j++) {
                let rand = Math.random();
                if (rand > muteChance) {
                    this.matrix[i][j] += Math.random();

                    if (this.matrix[i][j] > 1) {
                        this.matrix[i][j] = 1;
                    }
                    if (this.matrix[i][j] < -1) {
                        this.matrix[i][j] = -1;
                    }
                }
            }
        }
    }

    //----------------------------------------------------------------
    //Usage : generates a random number for col and row maxes. rows and cols below this number come from the initial matrix; those after come from the mate. Used to produce a series of different child options for each //mate pair
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    crossover(mate) {

        let child = new Matrix(this.rows, this.cols);

        let randCol = Math.floor(Math.random() * this.cols);
        let randRow = Math.floor(Math.random() * this.rows);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if ((i < randRow) || (i == randRow && j <= randCol)) {
                    child.matrix[i][j] = this.matrix[i][j];
                } else {
                    child.matrix[i][j] = mate.matrix[i][j];
                }
            }
        }

        return child;
    }

    clone() {

        let clone = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                clone.matrix[i][j] = this.matrix[i][j];
            }
        }
        return clone;
    }
}
