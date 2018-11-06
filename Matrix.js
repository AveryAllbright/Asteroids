class Matrix{
    
    constructor(rows, cols)
    {
        this.rows = rows;
        this.cols = cols;
        this.matrix = [];
        
        for(let i = 0; i < rows; i++)
            {
                this.matrix.push(Array[cols]);
            }
    }
    
    constructorMat(matrix)
    {
        this.matrix = matrix;
        this.rows = matrix.length;
        this.cols = matrix[0].length;
    }
    
    output()
    {
        for(let i = 0; i < this.rows; i++)
            {
                for(let j = 0; j < this.cols; j++)
                    {
                        console.log(this.matrix[i][j] + " ");
                    }
            }
    }
    
    multiply(n)
    {
        
    }
    
    dot(matrix)
    {
        
    }
    
    randomise()
    {
        
    }
    
    add(matrix)
    {
        
    }
    
    subtract(matrix)
    {
        
    }
    
    mult(matrix)
    {
        
    }
    
    transpose()
    {
        
    }
    
    singleColumnMatrix(array)
    {
        
    }
    
    fromArray(array)
    {
        
    }
    
    toArray()
    {
        
    }
    
    Bias()
    {
        
    }
    
    activate()
    {
        
    }
    
    //Sigmoids, or S curves, are used in a lot of learning networks to approximate how learning works. From Wiki: a progression from small beginnings that accelerates and approaches a climax over time.
    sigmoid()
    {
        
    }
    
    sigmoidDeprived()
    {
        
    }
    
    removeBottom()
    {
        
    }
    
    mutate()
    {
        
    }
    
    crossover(mate)
    {
         
    }
    
    clone()
    {
        
    }
    
    
    
    
    
    
    
    
    
}