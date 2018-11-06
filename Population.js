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

        for (let i = 0; i < players.length; i++) {
            if (!players[i].bDead) {
                players[i].look();
                players[i].think();
                players[i].update();
                if (!bShowBest || i == 0) {
                    players[i].draw();
                }
            }
        }
    }

    setBestPlayer() {
        let max = 0;
        let index = 0;
        for (let i = 0; i < players.length; i++) {
            if (players[i].fFitness > max) {
                max = players[i].fFitness;
                index = i;
            }
        }

        nBestPlayer = index;

        if (players[index].nScore > nBestScore) {
            nBestScore = players[index].nScore;
            BestPlayer = players[index].cloneForReplay();
        }
    }

    done() {
        for (let i = 0; i < players.length; i++) {
            if (!players[i].bDead) {
                return false;
            }
        }
        return true;
    }

    naturalSelection() {
        let newPlayers = Array[players.length];

        setBestPlayer();

        newPlayers[0] = players[nBestPlayer].cloneForReplay();

        for (let i = 1; i < players.length; i++) {
            if (i < players.length / 2) {
                newPlayers[i] = selectPlayer().clone();
            } else {
                newPlayers[i] = selectPlayer().crossover(selectPlayer());
            }

            newPlayers[i].mutate();
        }

        players = newPlayers.clone();
        gen++;
    }

    selectPlayer() {
        let fitness = 0;
        for (let i = 0; i < players.length; i++) {
            fitness += players[i].fFitness;
        }

        let rand = Math.floor(Math.random() * fitness);

        let sum = 0;

        for (let i = 0; i < players.length; i++) {
            sum += players[i].fFitness;
            if (sum > rand) {
                return players[i];
            }
        }
        return players[0];
    }


    mutate() {
        for (let i = 0; i < players.length; i++) {
            players[i].mutate();
        }
    }

    calculateFitness() {
        for (let i = 0; i < players.length; i++) {
            players[i].calculateFitness();
        }
    }
}
