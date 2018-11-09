//Population : This class is in charge of actually running the simulations. It uses the NeuralNet to force the ship to make decisions

class Population {

    //----------------------------------------------------------------
    //Usage : Creates the active list of ships for testing
    //Arg   : size - number of ships in the generation
    //Return: 
    //----------------------------------------------------------------
    constructor(size) {
        this.lPlayers = [];                     //The list of all current ships in a generation
        this.nBestPlayer = 0;                   //The index of the fittest ship in the current generation
        this.nCurrentPlayer = 0;                //The current index of the active ship. Used to iterate through the population
        this.nGen = 0;                          //The current generation number
        this.bestPlayer = new Player();         //Phyiscally storing the player at the best player index
        this.nBestScore = 0;                    //The best score achieved by a ship
        this.done = false;                      //used to switch from playing to generating the next generation of ships

        for (let i = 0; i < size; i++) {
            this.lPlayers.push(new Player());    //Add players to the array for the population size
        }
    }

    //----------------------------------------------------------------
    //Usage : Updates the current ship to play through until death
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    updateAlivePlayers() {

            if (!this.lPlayers[this.nCurrentPlayer].bDead) {    //Checks to see if current ship is alive
                this.lPlayers[this.nCurrentPlayer].look();   
                this.lPlayers[this.nCurrentPlayer].think();
                this.lPlayers[this.nCurrentPlayer].update();
                this.lPlayers[this.nCurrentPlayer].draw();
                }
        else{
            this.nCurrentPlayer++;                               //If the ship dies, update to the next ship in the generation
        }
        
    }

    //----------------------------------------------------------------
    //Usage : Determines the index of the fittest ship in a generation once all ships have died
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    setBestPlayer() {
        let max = 0;                                                 //Used to determine highest fitness
        let index = 0;                                               //Index of fittest ship
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].fFitness > max) {
                max = this.players[i].fFitness;                     //Sets max to current highest value
                index = i;                                          //Sets index to index of current fittest ship
            }
        }

        this.nBestPlayer = index;                                   //Sets the index of the fittest ship

        if (this.players[index].nScore > this.nBestScore) {         //Sets the best score to the fittest ship's score if it is higher
            this.nBestScore = this.players[index].nScore;       
            this.bestPlayer = this.players[index].cloneForReplay(); //Clones the ship for later use.
        }
    }

    //----------------------------------------------------------------
    //Usage : checks if the last ship has been destroyed
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    done() {
        if(!this.lPlayers[this.lPlayers.length - 1].bDead)
            {
                this.done = false;
            }
            
        
        this.done = true;
    }

    //----------------------------------------------------------------
    //Usage : Takes the upper half of the ship list and moves it to the next generation. Fills the second half of the next generation with children ships
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    naturalSelection() {
        let newPlayers = Array[this.lPlayers.length];        //Create a new list of the same population size

        this.setBestPlayer();                               //Grab the best ship from this generation

        newPlayers[0] = this.lPlayers[this.nBestPlayer].cloneForReplay();    //No matter what, the best ship in a generation is passed on to the next generation

        for (let i = 1; i < this.lPlayers.length; i++) {
            if (i < this.lPlayers.length / 2) {
                newPlayers[i] = this.selectPlayer().clone();                //Use the selection tool to fill the first half of the array with mostly the fittest ships (with some degree of random chance)
            } else {
                newPlayers[i] = this.selectPlayer().crossover(this.selectPlayer()); //Use the selection tool to generation children ships out of generally the fittest ships (with some dgree of random chance)
            }

            newPlayers[i].mutate();     //Once the ship has been generated, run it through the mutation tool to give it a possible genetic mutation.
        }

        this.lPlayers = newPlayers.clone();  //Clone the newly created generation to replace the current one
        this.nGen++;                        //Update the generation count
    }

    //----------------------------------------------------------------
    //Usage : Selects a ship from the population. Generally selects one of the fittest ships, but can generate suboptimal choices
    //Arg   : 
    //Return: a Ship. If no ship is available, returns the first ship in the array
    //----------------------------------------------------------------
    selectPlayer() {
        let fitness = 0;       //Fitness number is used to determine which ship to use
        for (let i = 0; i < this.lPlayers.length; i++) {
            fitness += this.lPlayers[i].fFitness;        //Sums up all the fitness scores of every ship in the population
        }

        let rand = Math.floor(Math.random() * fitness); //Generates a random number as a percentage of the total fitness value

        let sum = 0;    //Used to determine which ship is selected

        for (let i = 0; i < this.lPlayers.length; i++) {
            sum += this.lPlayers[i].fFitness;        //Sum is added to be adding the fitness value of each ship.
            if (sum > rand) {
                return this.lPlayers[i];             //Once the sum is higher than the fitness clearance percent, the ship that broke the threshold is returned.
                                                    //Since ships with a higher fitness score contribute more to the sum, they are the most likely to be selected for the return
            }
        }
        return this.players[0];                     //If somehow no ship clears the sum threshold, return the first ship (for error catching)
    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through their mutation tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    mutate() {
        for (let i = 0; i < this.lPlayers.length; i++) {
            this.lPlayers[i].mutate();
        }
    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    calculateFitness() {
        for (let i = 0; i < this.lPlayers.length; i++) {
            this.lPlayers[i].calculateFitness();
        }
    }
}
