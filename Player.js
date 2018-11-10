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
        this.lAsteroids.push(new Asteroid(Math.random() * this.w, 0, Math.random() * (2) - 1, Math.random(2) - 1, 3));
        this.lAsteroids.push(new Asteroid(Math.random() * this.w, 0, Math.random() * (2) - 1, Math.random(2) - 1, 3));
        this.lAsteroids.push(new Asteroid(0, Math.random() * this.h, Math.random() * (2) - 1, Math.random(2) - 1, 3));
        this.lAsteroids.push(new Asteroid(Math.random() * this.w, Math.random() * this.h, Math.random() * (2) - 1, Math.random(2) - 1, 3));

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
            if (this.nITimer > 0 && Math.floor(this.nITimer.toFixed(2) / 5) % 2 == 0) {} else {
                this.drawShip();
            }
            for (let asteroid of this.lAsteroids) {
                asteroid.draw();
            }
        }
    }

    //----------------------------------------------------------------
    //Usage : Spawns bullets and increments shot count
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    shoot() {
        if (this.bCanShoot) { //only shoot if the timer has gone down
            this.lBullets.push(new Bullet(this.vPos.x, this.vPos.y, this.fRotation, this.vVel.mag())); //spawn a new bullet at the ship
            this.nShotDelay = 30; //Reset the shot timer
            this.bCanShoot = false; //reset the shot allowance
            this.nShotsFired++; //increment the shoot count
        }
    }

    //----------------------------------------------------------------
    //Usage : Turns off Bullets once their live span has expired, removes them from array, moves all entities, and checks for collisions
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
    //Usage : Checks for all collisions between the bullets and asteroids, and asteroids and the ship
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    checkPositions() {

        for (let i = 0; i < this.lBullets.length; i++) {
            for (let j = 0; j < this.lAsteroids.length; j++) {
                if (this.lAsteroids[j].Hit(this.lBullets[i])) {
                    this.nShotsHit++; //increments successful hits for hit ratio
                    this.lBullets.splice(i, 1); //removes the bullet
                    this.nScore++; //and ups the score
                    let size = this.lAsteroids[j].nSize;
                    size--;
                    let place = this.lAsteroids[j].vPos;
                    this.lAsteroids.splice(j,1);
                    this.lAsteroids.push(new Asteroid(place.x + Math.random() * 3 - 5, place.y + Math.random() * 3 - 5, Math.random() * (2) - 1, Math.random(2) - 1, size));
                    this.lAsteroids.push(new Asteroid(place.x + Math.random() * 3 - 5, place.y + Math.random() * 3 - 5, Math.random() * (2) - 1, Math.random(2) - 1, size));
                    this.lAsteroids.push(new Asteroid(place.x + Math.random() * 3 - 5, place.y + Math.random() * 3 - 5, Math.random() * (2) - 1, Math.random(2) - 1, size));
                    break;
                }
            }
        }
        if (this.nITimer <= 0) { //Only count collisions if the iFrame timer isn't active
            for (let asteroid of this.lAsteroids) {
                if (asteroid.onHit(this.vPos)) {
                    this.playerHit();
                }
            }
        }
    }

    //----------------------------------------------------------------
    //Usage : reset the ship to the center of the world. Only used if reset is enabled
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    resetPos() {
        this.vPos = Vec2(this.w / 2, this.h / 2);
        this.vVel = Vec2(0, 0);
        this.vAcc = Vec2(0, 0);
        this.lBullets = [];
        this.fRotation = 0.0;
    }

    //----------------------------------------------------------------
    //Usage : deals with player death
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
    //Usage : Deals with bounding and looping the screen
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
    //Usage : Fitness Test
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    CalculateFitness() {

        let hitRate = parseFloat(this.nShotsHit) / parseFloat(this.nShotsFired); //Percentage of shots that hit asteroids
        this.fFitness = (this.nScore + 1) * 10; //Min 10
        this.fFitness *= this.nLifeSpan;
        this.fFitness *= hitRate * hitRate; //Uses hitRate squared to force fitness's top priority to be aiming. 
        //Final fitness is determined by score * time alive *(hitRate * hitRate)

    }

    //----------------------------------------------------------------
    //Usage : Uses the NeuralNet's mutation tool to cause random mutations
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    mutation() {
        this.brain.mutate(fGlobalMuteChance);
    }

    //----------------------------------------------------------------
    //Usage : creates a duplicate of the NeuralNet brain
    //Arg   : 
    //Return: Net brain duplicate
    //----------------------------------------------------------------
    clone() {
        let clone = new Player();
        clone.brain = this.brain.clone();
        return clone;
    }

    //----------------------------------------------------------------
    //Usage : Creates a clone of the current ship and seed so the same run can be replayed
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    cloneForReplay() {
        let clone = new Player();
        clone.brain = this.brain.clone();
        return clone;
    }

    //----------------------------------------------------------------
    //Usage : Uses the Net Brain to create a child ship from this ship and a mate
    //Arg   : 
    //Return: a Ship who's Net Brain is comprised of a crossover between this and the mate's Net Brains
    //----------------------------------------------------------------
    crossover(mate) {
        let child = new Player();
        child.brain = this.brain.crossover(mate.brain);
        return child;
    }

    //----------------------------------------------------------------
    //Usage : searches in 8 directions around the ship
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    look() {
        this.vision.push(0, 0, 0, 0, 0, 0, 0, 0, 0); //Reset the vision array to all 0s

        let direction = Vec2(0, 0); //Look Direction
        for (let i = 0; i < this.vision.length; i++) {
            direction = Vec2(1, 0); //Start at Right Vector
            direction.rotate((this.fRotation + i * (Math.PI / 4))); //Rotate around in 1/8th increments
            direction.mul(10);
            this.vision[i] = this.lookTowards(direction); //Use the look towards to search for threats in that zone
        }

        //Prioritise shooting
        if (this.bCanShoot && this.vision[0] != 0) {
            this.vision[8] = 1;
        } else {
            this.vision[8] = 0;
        }
    }

    //----------------------------------------------------------------
    //Usage : Looks out in a line towards the current direction to look for threats
    //Arg   : direction vector
    //Return: returns either 0 for no threat, or a percentage value representing how far away the threat is 
    //----------------------------------------------------------------
    lookTowards(direction) {

        let pos = Vec2(this.vPos.x, this.vPos.y); //start from the ship
        let distance = 0;

        pos.translate(direction); //move out by one direction vector distance
        distance++; //update distance by 1 increment

        while (distance < 60) {
            for (let i = 0; i < this.lAsteroids.length; i++) {
                if (this.lAsteroids[i].lookForHit(pos)) {
                    return 1 / distance; //if the asteroid is within 60 distances of the ship, return a nonZero. 1/1 represents the closest possible threat
                }
            }

            pos.translate(direction); //move out by one direction vector distance

            //Account for screen looping            
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
    //Usage : Runs the vision array through the Neural Net to make decisions on actions
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    think() {
        this.decision = this.brain.output(this.vision); //create the decision array by running the threat detections through the Network

        //If any decision returns a value of 80% or higher (using a matrix that is comprised of -1 or 1 data values) it is performed        

        if (this.decision[0] > 0.8) { //Line 1 accounts for movement
            this.bBooster = true;
        } else {
            this.bBooster = false;
        }
        if (this.decision[1] > 0.8) { //Line 2 accounts for left spinning
            this.fSpin = -0.05;
        } else {
            if (this.decision[2] > 0.8) { //Line 3 accounts for right spinning
                this.fSpin = 0.05;
            } else {
                this.fSpin = 0;
            }
        }
        if (this.decision[3] > 0.8) { //Line 4 accounts for shooting
            this.shoot();
        }
        
        for(let i = 0; i < this.vision.length; i++)
            {
                this.vision.pop();
            }
    }

    //----------------------------------------------------------------
    //Usage : Draw code for the ship has been moved here to increase readability. 
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
