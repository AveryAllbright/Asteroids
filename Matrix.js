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
        let result = Matrix(this.rows, matrix.cols);

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

        let newMat = Matrix(this.rows, this.cols);

        if (this.matrix.rows == matrix.rows && this.matrix.cols == matrix.cols) {

            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    newMat = this.matrix[i][j] + matrix[i][j];
                }
            }
        }
        
        return newMat;
    }

    subtract(matrix) {
        
        let newMat = Matrix(this.rows, this.cols);

        if (this.matrix.rows == matrix.rows && this.matrix.cols == matrix.cols) {

            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    newMat = this.matrix[i][j] - matrix[i][j];
                }
            }
        }
        
        return newMat;

    }

    mult(matrix) {

    }

    transpose() {

    }

    singleColumnMatrix(array) {

    }

    fromArray(array) {

    }

    toArray() {

    }

    Bias() {

    }

    activate() {

    }

    //Sigmoids, or S curves, are used in a lot of learning networks to approximate how learning works. From Wiki: a progression from small beginnings that accelerates and approaches a climax over time.
    sigmoid() {

    }

    sigmoidDeprived() {

    }

    removeBottom() {

    }

    mutate() {

    }

    crossover(mate) {

    }

    clone() {

    }









}
