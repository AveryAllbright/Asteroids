class Matrix {

    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.matrix = [];

        for (let i = 0; i < rows; i++) {
            this.matrix.push([cols]);
        }
    }

    constructorMat(matrix) {
        this.matrix = matrix;
        this.rows = matrix.length;
        this.cols = matrix[0].length;
    }

    output() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                console.log(this.matrix[i][j] + " ");
            }
        }
    }

    multiply(n) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] *= n;
            }
        }
    }

    dot(matrix) {
        let result = new Matrix(this.rows, matrix.cols);

        if (this.cols == matrix.rows) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < matrix.cols; j++) {
                    let sum = 0;
                    for (let k = 0; k < this.cols; k++) {
                        sum += this.matrix[i][k] * matrix[k][j];
                    }
                    result.matrix[i][j] = sum;
                }
            }
        }

        return result;
    }

    randomise() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] = Math.random() < 0.5 ? -1 : 1;
            }
        }
    }

    add(n) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] += n;
            }
        }
    }

    addMatrix(matrix) {

        let newMat = new Matrix(this.rows, this.cols);

        if (this.matrix.rows == matrix.rows && this.matrix.cols == matrix.cols) {

            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    newMat.matrix[i][j] = this.matrix[i][j] + matrix[i][j];
                }
            }
        }

        return newMat;
    }

    subtract(matrix) {

        let newMat = new Matrix(this.rows, this.cols);

        if (this.matrix.rows == matrix.rows && this.matrix.cols == matrix.cols) {

            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    newMat.matrix[i][j] = this.matrix[i][j] - matrix[i][j];
                }
            }
        }

        return newMat;

    }

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

    transpose() {

        let newMat = new Matrix(this.cols, this.rows);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                newMat.matrix[j][i] = this.matrix[i][j];
            }
        }

        return newMat;

    }

    singleColumnMatrix(array) {

        let newMat = new Matrix(array.length, 1);
        for (let i = 0; i < array.length; i++) {
            newMat.matrix[i][0] = array[i];
        }

    }

    fromArray(array) {

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] = array[j + i * this.cols];
            }
        }

    }

    toArray() {

        let array = [this.rows * this.cols];

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                array[j + i * this.cols] = matrix[i][j];
            }
        }

        return array;


    }

    Bias() {

        let newMat =  new Matrix(this.rows + 1, 1);
        for (let i = 0; i < this.rows; i++) {
            newMat.matrix[i][0] = this.matrix[i][0];
        }
        newMat.matrix[this.rows][0] = 1;
        return newMat;

    }

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

    removeBottom() {

        let newMat = new Matrix(this.rows - 1, this.cols);

        for (let i = 0; i < newMat.rows; i++) {
            for (let j = 0; j < this.rows; j++) {
                newMat.matrix[i][j] = this.matrix[i][j];
            }
        }

        return newMat;

    }

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

    crossover(mate) {
        
        let child = new Matrix(this.rows, this.cols);
        
        let randCol = Math.floor(Math.random() * this.cols);
        let randRow = Math.floor(Math.random() * this.rows);
        
        for(let i = 0; i < this.rows; i++)
            {
                for(let j = 0; j < this.cols; j++)
                    {
                        if((i < randRow) || (i == randRow && j <= randCol))
                            {
                                child.matrix[i][j] = this.matrix[i][j];
                            }
                        else{
                            child.matrix[i][j] = mate.matrix[i][j];
                        }
                    }
            }
        
        return child;

    }

    clone() {
        
        let clone = new Matrix(this.rows, this.cols);
        for(let i = 0; i < this.rows; i++)
            {
                for(let j = 0; j < this.cols; j++)
                    {
                        clone.matrix[i][j] = this.matrix[i][j];
                    }
            }
        return clone;

    }


}
