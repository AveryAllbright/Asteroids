class Player {


    constructor(width, height) {
        
        this.w = ctx.width; 
        this.h = ctx.height;
        
        this.vPos = Vec2(this.w / 2, this.h / 2);
        this.vVel = Vec2(0,0);
        this.vAcc = Vec2(0,0);


        this.nScore = 0;
        this.nShotDelay = 0;
        this.fRotation = 0;; //ships current angle;
        this.fSpin = 0.0; // Angle++
        this.fMaxSpeed = 10;
        this.bBooster = false;
        this.lBullets = [];
        this.lAsteroids = [];

        this.nAsteroidTimer = 1000;
        this.nLives = 0;
        this.bDead = false;
        this.nITimer = 0;
        this.nBoostTimer = 10;


        this.brain = new NeuralNet(9, 16, 4); //Net
        this.vision = [];
        this.decision = [];
        this.bReplay = false;
        this.nlSeedUsed;
        this.lSeeds = [];
        this.nUpToSeedNo = 0; // Current seed position
        this.fFitness = 0.0;

        this.nShotsFired = 4; //Encourage shooting;
        this.nShotsHit = 1; //starting at nonZero number to force improvement

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


    move() {

        if (!this.bDead) {
            this.checkTimer();
            this.Rotate();
            if (this.bBooster) {
                this.boost();
            } else {
                this.offBoost();
            }

            this.vVel.translate(this.vAcc);
            this.vVel.limit(this.fMaxSpeed);
            this.vVel.mul(0.99);
            this.vPos.translate(this.vVel);

            for (let i = 0; i < this.lBullets.length; i++) {
                this.lBullets[i].move();
            }
            for (let i = 0; i < this.lAsteroids.length; i++) {
                this.lAsteroids[i].move();
            }
            if (outOfBounds(this.vPos)) {
                this.loop();
            }
        }

    }

    checkTimer() {

        this.nLifespan++;
        this.nShotDelay--;
        this.nAsteroidTimer--;

        if (this.nAsteroidTimer <= 0) {
            let randX = Math.random() * this.w;
            let randY = -50 + Math.floor(Math.random() * 2 * (height + 100));
            this.lAsteroids.push(new Asteroid(randX, randY, this.vPos.x - randX, this.vPos.y - randY, 3));
            this.nAsteroidTimer = 10000;
        }
        if (this.nShotDelay <= 0) {
            this.bCanShoot = true;
        }

    }

    boost() {
        this.vAcc = Vec2(1, 0);
        this.vAcc.rotate(this.fRotation);
        this.vAcc.mul(.1);
    }

    offBoost() {
        this.vAcc = Vec2(0, 0);

    }

    Rotate() {

        this.fRotation += this.fSpin;

    }

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
               
            }

            for (let asteroid of this.lAsteroids) {
                asteroid.draw();
            }
            
             this.drawShip();
        }

    }


    shoot() {
        if (this.bCanShoot) {
            this.lBullets.push(new Bullet(this.vPos.x, this.vPos.y, this.fRotation, this.vVel.mag()));
            this.nShotDelay = 30;
            this.bCanShoot = false;
            this.nShotsFired++;
        }
    }

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
            
            for(let asteroid of this.lAsteroids)
                {
                    if(asteroid.onHit(this.vPos))
                        {
                            this.playerHit();
                        }
                }
            
        }
    }

    resetPos() {

        this.vPos = Vec2(width / 2, height / 2);
        this.vVel = Vec2(0,0);
        this.vAcc = Vec2(0,0);
        this.lBullets = [];
        this.fRotation = 0.0;
    }

    playerHit() {
        
        console.log("ow");
        
        if (this.nLives == 0) {
            this.bDead = true;
        } else {
            this.nLives--;
            this.nITimer = 100;
            this.resetPos();
        }
    }

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

    //---------------------------------------------------------------------------------------------------
    //Genetic Algorithm Stuff

    CalculateFitness() {

        let hitRate = parseFloat(this.nShotsHit) / parseFloat(this.nShotsFired);
        this.fFitness = (this.nScore + 1) * 10; //Min 10
        this.fFitness *= this.nLifeSpan;
        this.fFitness *= hitRate * hitRate; //Uses hitRate squared to force fitness's top priority to be aiming. 

    }

    mutation() {
        this.brain.mutate(fGlobalMuteChance);
    }

    //------------------------------------------------------
    //Brainy Stuffs that I kind of understand
    clone() {
        let clone = new Player();
        clone.brain = this.brain.clone();
        return clone;
    }

    cloneForReplay() {

        //Only used if the random seed content ends up being implemented. 

    }

    crossover(parent2) {

        let child = new Player();
        child.brain = brian.crossover(parent2.brain);
        return child;

    }

    look() {

        this.vision.push(0,0,0,0,0,0,0,0,0);

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

    saveMe() {
        //File stuff
    }

    loadMe() {
        //Loading file stuff
    }

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
    
    drawShip()
    {
        
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        ctx.moveTo(this.vPos.x, this.vPos.y);
        ctx.lineTo(this.vPos.x - 10,this.vPos.y  + 10);
        ctx.lineTo(this.vPos.x -10,this.vPos.y - 10);
        ctx.lineTo(this.vPos.x, this.vPos.y);
        ctx.stroke();
    }
}
