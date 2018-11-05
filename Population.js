class Population {

    let players = Array[];
    let nBestPlayer;
    let nGen = 0;
    let bestPlayer;
    let nBestScore = 0;


    function constructor(size) {
        players = new Player[size];
        for (let i = 0; i < players.length; i++) {
            players[i] = new Player();
        }
    }

    //----------------------------------
    //Update living players

    function updateAlivePlayers() {

        for(let i = 0; i < players.length; i++)
            {
                if(!players[i].bDead)
                    {
                        players[i]''
                    }
            }
        
    }


}
