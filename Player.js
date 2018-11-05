class Player {

    let vPos;
    let vVel;
    let vAcc;

    let nScore = 0;
    let nShotDelay = 0;
    let fRotation; //ships current angle;
    let fSpin; // Angle++
    const
    let fMaxSpeed = 10;
    let bBooster = false;
    let lBullets = Array[];
    let lAsteroids = Array[];

    let nAsteroidTimer = 1000;
    let nLives = 0;
    let bDead = false;
    let nITimer = 0;
    let nBoostTimer = 10;


    let brain; //Net
    let vision = new Array[8];
    let dection = new Array[4];
    let bReplay = false;
    let nlSeedUsed;
    let lSeeds = Array[];
    let nUpToSeedNo = 0; // Current seed position
    let fFitness;

    let nShotsFired = 4; //Encourage shooting;
    let nShotsHit = 1; //starting at nonZero number to force improvement

    let nLifeSpan = 0; //Counting timer of how long the bot lived, for fitness equation.

    let bCanShoot = true; //Used with shotDelay to pace out shots



    function constructor() {
        let w = document.innerWidth;
        let h = document.innerHeight;

        vPos = new Vec2(w / 2, h / 2);
        vVel = new Vec2();
        vAcc = new Vec2();

        fRotation = 0;
        nlSeedUsed = Math.floor(Math.random() * (100000000));
        //randomSeed(nlSeedUsed);


        //Generate Starting Asteroids
        lAsteroids.add(new Asteroid(Math.random() * w, 0, Math.random() * (1 - -1) - 1), Math.random(1 - -1) - 1, 3);
        lAsteroids.add(new Asteroid(Math.random() * w, 0, Math.random() * (1 - -1) - 1), Math.random(1 - -1) - 1, 3);
        lAsteroids.add(new Asteroid(Math.random() * w, 0, Math.random() * (1 - -1) - 1), Math.random(1 - -1) - 1, 3);
        lAsteroids.add(new Asteroid(Math.random() * w, 0, Math.random() * (1 - -1) - 1), Math.random(1 - -1) - 1, 3);

        //aim one towards the player
        let randX = Math.random() * w;
        let randY = -50 + Math.floor(Math.random() * 2) * (h + 100);
        lAsteroids.add(new Asteroid(randX, randY, vPos.x - randX, vPos.y - randY, 3));
        brain = new NeuralNet(9, 16, 4);
    }


    function move() {

    }

    function checkTimer() {

    }

    function boost() {

    }

    function offBoost() {

    }

    function Rotate() {

    }

    function draw() {

    }

    function shoot() {

    }

    function update() {

    }

    function checkPositions() {

    }

    function resetPos() {

    }

    function playerHit() {

    }

    function loop() {

    }

    //---------------------------------------------------------------------------------------------------
    //Genetic Algorithm Stuff

    function CalculateFitness() {

    }

    function mutation() {

    }

    //------------------------------------------------------
    //Brainy Stuffs that I kind of understand
    Player clone() {

    }

    Player cloneForReplay() {

    }

    Player crossover() {

    }

    function look() {

    }

    function lookTowards() {

    }

    function saveMe() {

    }

    function loadMe() {

    }

    function think() {

    }


}
