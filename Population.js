class Population {

    constructor(size) {


        this.players = [];
        this.nBestPlayer = 0;
        this.nGen = 0;
        this.bestPlayer;
        this.nBestScore = 0;

        this.players = [];
        for (let i = 0; i < size; i++) {
            this.players.push(new Player());
        }
    }

    //----------------------------------
    //Update living players

    updateAlivePlayers() {

        for (let i = 0; i < this.players.length; i++) {
            if (!this.players[i].bDead) {
                this.players[i].look();
                this.players[i].think();
                this.players[i].update();
                if (!bShowBest || i == 0) {
                    this.players[i].draw();
                }
            }
        }
    }

    setBestPlayer() {
        let max = 0;
        let index = 0;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].fFitness > max) {
                max = this.players[i].fFitness;
                index = i;
            }
        }

        this.nBestPlayer = index;

        if (this.players[index].nScore > this.nBestScore) {
            this.nBestScore = this.players[index].nScore;
            this.bestPlayer = this.players[index].cloneForReplay();
        }
    }

    done() {
        for (let i = 0; i < this.players.length; i++) {
            if (!this.players[i].bDead) {
                return false;
            }
        }
        return true;
    }

    naturalSelection() {
        let newPlayers = Array[this.players.length];

        this.setBestPlayer();

        newPlayers[0] = this.players[this.nBestPlayer].cloneForReplay();

        for (let i = 1; i < this.players.length; i++) {
            if (i < this.players.length / 2) {
                newPlayers[i] = this.selectPlayer().clone();
            } else {
                newPlayers[i] = this.selectPlayer().crossover(this.selectPlayer());
            }

            newPlayers[i].mutate();
        }

        this.players = newPlayers.clone();
        this.nGen++;
    }

    selectPlayer() {
        let fitness = 0;
        for (let i = 0; i < this.players.length; i++) {
            fitness += this.players[i].fFitness;
        }

        let rand = Math.floor(Math.random() * fitness);

        let sum = 0;

        for (let i = 0; i < this.players.length; i++) {
            sum += this.players[i].fFitness;
            if (sum > rand) {
                return this.players[i];
            }
        }
        return this.players[0];
    }


    mutate() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].mutate();
        }
    }

    calculateFitness() {
        for (let i = 0; i < this.players.length; i++) {
            this.players[i].calculateFitness();
        }
    }
}
