//Player is used to generate both the ship itself, and the gameplay content (bullets and asteroids)
//Handles everything that the ship needs to know in order to play the game well

class Player {

    //----------------------------------------------------------------
    //Usage : Generates a Ship and the asteroids for its run
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    constructor() {
        this.w = ctx.width; //Used to ensure bounds are kept
        this.h = ctx.height; //used to ensure bounds are kept

        this.vPos = Vec2(this.w / 2, this.h / 2); //Every ship will start at the very center of the board
        this.vVel = Vec2(0, 0); //Ships start stationary, and move by adding velocity
        this.vAcc = Vec2(0, 0); //Velocity is updated via basic acceleration. Ships slow to a stop, rather than simply stopping


        this.nScore = 0; //The current score for the active ship
        this.nShotDelay = 0; //Used to keep ships from firing too often
        this.fRotation = 0; //ship's current angle;
        this.fSpin = 0.0; //Used to sprin the ship in place
        this.fMaxSpeed = 10; //Used to keep the ship from moving too quickly
        this.bBooster = false; //Ships in Asteroids use a booster to move forward, and can only turn while moving. Otherwise, they simply spin in place
        this.lBullets = []; //List of all active bullets fired by the active ship
        this.lAsteroids = []; //List of all asteroids on the map

        this.nAsteroidTimer = 1000; //Used to determine when the next asteroid should span
        this.nLives = 0; //Bonus lives. Since the current build requires only one ship to be active at a time, each ship only gets one chance to play 
        this.bDead = false; //Used to determine if the current ship has been destroyed
        this.nITimer = 0; //In games where ships get more than one life, this is used to give the ship both physical and visible iFrames

        this.brain = new NeuralNet(4, 4, 2); //Neural Network. The size of each of the three elements determines the overall brain power of the Net (described better within)
        this.vision = []; //Array of vision choices. Used to determine the closest object in 8 directions
        this.decision = []; //Array of optional choices. Used to determine what the ship should do at any given point
        this.bReplay = false; //Used to determine if the current run should be reattempted. Currently not used
        this.nlSeedUsed; //Used for random seed generation. Seed generator not implemented
        this.lSeeds = []; //List of all used seeds. Seed generator not implemented
        this.nUpToSeedNo = 0; //Current seed position in the seed list. used to retun to previous seeds. Seed generator not implemented
        this.fFitness = 0.0; //Used to track the fitness score of the active ship

        this.nShotsFired = 4; //Encourage shooting by lying about how many shots had already been fired. Forces ships to improve their aim
        this.nShotsHit = 1; //Ships start out with a 25% hit rate. Since this reflects very poorly on their fitness level, it forces ships to improve aim over simply trying to survive the longest

        this.nLifeSpan = 0; //Counting timer of how long the bot lived, for fitness equation.
        this.bCanShoot = true; //Used with shotDelay to pace out shots

        this.nlSeedUsed = Math.floor(Math.random() * (100000000));

        //Generate Starting Asteroids
        this.lAsteroids.push(new Asteroid(Math.random() * this.w, 0, Math.random() * (1 - -1) - 1, Math.random(1 - -1) - 1, 3));
        this.lAsteroids.push(new Asteroid(Math.random() * this.w, 0, Math.random() * (1 - -1) - 1, Math.random(1 - -1) - 1, 3));
        this.lAsteroids.push(new Asteroid(Math.random() * this.w, 0, Math.random() * (1 - -1) - 1, Math.random(1 - -1) - 1, 3));
        this.lAsteroids.push(new Asteroid(Math.random() * this.w, 0, Math.random() * (1 - -1) - 1, Math.random(1 - -1) - 1, 3));

        //aim one towards the player
        let randX = Math.random() * this.w;
        let randY = -50 + Math.floor(Math.random() * 2) * (this.h + 100);
        this.lAsteroids.push(new Asteroid(randX, randY, this.vPos.x - randX, this.vPos.y - randY, 3));
        this.brain = new NeuralNet(9, 16, 4);
    }

    //----------------------------------------------------------------
    //Usage : Used to physically move the ship through space
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    move() {
        if (!this.bDead) { //Only update if the ship is still alive
            this.checkTimer(); //Update all the important timers
            this.Rotate(); //Rotation takes priority over linear movement
            if (this.bBooster) { //Move forward only if boosting
                this.boost();
            } else {
                this.offBoost(); //Slow down if not boosting
            }

            this.vVel.translate(this.vAcc); //Add the current Acceleration to the Velocity
            this.vVel.limit(this.fMaxSpeed); //Ensure that the velocity is not higher than allowed. Limit not implemented 
            this.vVel.mul(0.99); //Slow it down just a tad
            this.vPos.translate(this.vVel); //Add the velocity to the position to move the ship forward

            for (let i = 0; i < this.lBullets.length; i++) { //Care about updating the bullet positions
                this.lBullets[i].move();
            }
            for (let i = 0; i < this.lAsteroids.length; i++) { //Care about updating the asteroid positions
                this.lAsteroids[i].move();
            }
            if (outOfBounds(this.vPos)) { //Care about looping once out of bounds
                this.loop();
            }
        }
    }

    //----------------------------------------------------------------
    //Usage : Updates the primary timers, and deals with threshold clearances
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    checkTimer() {
        this.nLifespan++; //update how many frames the ship has been alive for
        this.nShotDelay--; //update the shot timer, to pace out shots
        this.nAsteroidTimer--; //update the asteroid spawn timere

        if (this.nAsteroidTimer <= 0) { //if the asteroid timer is ready, spawn an additional asteroids
            let randX = Math.random() * this.w; //give it a random position across x
            let randY = -50 + Math.floor(Math.random() * 2 * (height + 100)); //its y position will be roughly near the middle each time
            this.lAsteroids.push(new Asteroid(randX, randY, this.vPos.x - randX, this.vPos.y - randY, 3)); //push the new asteroid into the array
            this.nAsteroidTimer = 1000; //reset the timer    
        }
        if (this.nShotDelay <= 0) { //if the shot timer is ready, the ship can shoot again
            this.bCanShoot = true; //so let it do so
        }
    }

    //----------------------------------------------------------------
    //Usage : Set the acceleration while boosting 
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    boost() {
        this.vAcc = Vec2(1, 0); //Unit vector to the right
        this.vAcc.rotate(this.fRotation); //rotate the vector to match the angle of the ship
        this.vAcc.mul(.1); //cut it to 10%
    }

    //----------------------------------------------------------------
    //Usage : Remove the acceleration Vector
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    offBoost() {
        this.vAcc = Vec2(0, 0);
    }

    //----------------------------------------------------------------
    //Usage : Update the rotation value by the spin amount
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    Rotate() {
        this.fRotation += this.fSpin; //The sprin amount is zero unless spin keys are pressed
    }

    //----------------------------------------------------------------
    //Usage : Draws the Ship, the bullets, and the asteroids
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    draw() {
        if (!this.bDead) {
            for (let i = 0; i < this.lBullets.length; i++) {
                this.lBullets[i].draw();
            }
            if (this.nITimer > 0) {
                this.nITimer--;
            }

            if (this.nITimer > 0 && Math.floor(this.nITimer.toFixed(2) / 5) % 2 == 0) {

            } else {
                this.drawShip();
            }

            for (let asteroid of this.lAsteroids) {
                asteroid.draw();
            }


        }

    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    shoot() {
        if (this.bCanShoot) {
            this.lBullets.push(new Bullet(this.vPos.x, this.vPos.y, this.fRotation, this.vVel.mag()));
            this.nShotDelay = 30;
            this.bCanShoot = false;
            this.nShotsFired++;
        }
    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    update() {
        for (let i = 0; i < this.lBullets.length; i++) {
            if (this.lBullets[i].bOff) {
                this.lBullets.splice(i, 1);
                break;
            }
        }
        this.move();
        this.checkPositions();
    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    checkPositions() {

        for (let i = 0; i < this.lBullets.length; i++) {
            for (let j = 0; j < this.lAsteroids.length; j++) {
                if (this.lAsteroids[j].Hit(this.lBullets[i])) {
                    this.nShotsHit++;
                    this.lBullets.splice(i, 1);
                    this.nScore++;
                    break;
                }
            }
        }


        if (this.nITimer <= 0) {

            for (let asteroid of this.lAsteroids) {
                if (asteroid.onHit(this.vPos)) {
                    this.playerHit();
                }
            }

        }
    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    resetPos() {

        this.vPos = Vec2(width / 2, height / 2);
        this.vVel = Vec2(0, 0);
        this.vAcc = Vec2(0, 0);
        this.lBullets = [];
        this.fRotation = 0.0;
    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    playerHit() {

        if (this.nLives == 0) {
            this.bDead = true;
        } else {
            this.nLives--;
            this.nITimer = 100;
            this.resetPos();
        }
    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    loop() {
        if (this.vPos.y < -50) {
            this.vPos.y = height + 50;
        } else {
            if (this.vPos.y > height + 50) {
                this.vPos.y = -50;
            }
        }
        if (this.vPos.x < -50) {
            this.vPos.x = width + 50;
        } else if (this.vPos.x > width + 50) {
            this.vPos.x = -50;
        }
    }

    //----------------------------------------------------------------
    //Genetic Algorithm Stuff
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    CalculateFitness() {

        let hitRate = parseFloat(this.nShotsHit) / parseFloat(this.nShotsFired);
        this.fFitness = (this.nScore + 1) * 10; //Min 10
        this.fFitness *= this.nLifeSpan;
        this.fFitness *= hitRate * hitRate; //Uses hitRate squared to force fitness's top priority to be aiming. 

    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    mutation() {
        this.brain.mutate(fGlobalMuteChance);
    }

    //----------------------------------------------------------------
    //Brainy Stuffs that I kind of understand
    //----------------------------------------------------------------

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    clone() {
        let clone = new Player();
        clone.brain = this.brain.clone();
        return clone;
    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    cloneForReplay() {

        //Only used if the random seed content ends up being implemented. 

    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    crossover(parent2) {

        let child = new Player();
        child.brain = brian.crossover(parent2.brain);
        return child;

    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    look() {

        this.vision.push(0, 0, 0, 0, 0, 0, 0, 0, 0);

        let direction = Vec2(-1, 0);
        for (let i = 0; i < this.vision.length; i++) {
            direction = Vec2(1, 0);
            direction.rotate((this.fRotation + i * (Math.PI / 4)));
            direction.mul(10);
            this.vision[i] = this.lookTowards(direction);
        }

        if (this.bCanShoot && this.vision[0] != 0) {
            this.vision[8] = 1;
        } else {
            this.vision[8] = 0;
        }
    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    lookTowards(direction) {

        let pos = Vec2(this.vPos.x, this.vPos.y);
        let distance = 0;

        pos.translate(direction);
        distance++;

        while (distance < 60) {
            for (let i = 0; i < this.lAsteroids.length; i++) {
                if (this.lAsteroids[i].lookForHit(pos)) {
                    return 1 / distance;
                }
            }

            pos.translate(direction);

            if (pos.y < -50) {
                pos.y = height + 100;
            } else
            if (pos.y > height + 50) {
                pos.y = -100;
            }
            if (pos.x < -50) {
                pos.x = width + 50;
            } else if (pos.x > width + 50) {
                pos.x = -50;
            }
            distance++;
        }

        return 0;

    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    saveMe() {
        //File stuff
    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    loadMe() {
        //Loading file stuff
    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    think() {

        this.decision = this.brain.output(this.vision);

        if (this.decision[0] > 0.8) {
            this.bBooster = true;
        } else {
            this.bBooster = false;
        }
        if (this.decision[1] > 0.8) {
            this.fSpin = -0.05;
        } else {
            if (this.decision[2] > 0.8) {
                this.fSpin = 0.05;
            } else {
                this.fSpin = 0;
            }
        }

        if (this.decision[3] > 0.8) {
            this.shoot();
        }
    }

    //----------------------------------------------------------------
    //Usage : Goes through the list of players and runs them through the fitness tool
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    drawShip() {
        ctx.save();
        ctx.translate(this.vPos.x, this.vPos.y);
        ctx.rotate(this.fRotation);
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-10, 10);
        ctx.lineTo(-10, -10);
        ctx.lineTo(0, 0);
        ctx.stroke();
        ctx.restore();
    }
}
