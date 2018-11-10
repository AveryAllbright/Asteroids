//Asteroids are the singular threats to the ship, and define its entire decision making process

class Asteroid {

    //----------------------------------------------------------------
    //Usage : Creates a new Asteroid
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    constructor(posX, posY, velX, velY, size) {
        this.vPos; //Position Data
        this.vVel; //Speed Data

        this.nSize; //Asteroids are between radius 40 and radius 10, and get smaller when hit. Size reductions not fully implemented.
        this.fRadius;

        this.lChunks = []; //List containing the chunks of an asteroid after it breaks
        this.bSplit = false; //whether or not an asteroid is broken up

        this.vPos = Vec2(posX, posY);
        this.nSize = size;
        this.vVel = Vec2(velX, velY);

        switch (this.nSize) {
            case 1:
                this.fRadius = 10;
                this.vVel.normalise();
                this.vVel.mul(1.25);
                break;
            case 2:
                this.fRadius = 30;
                this.vVel.normalise();
                this.vVel.mul(1.0);
                break;
            case 3:
                this.fRadius = 60;
                this.vVel.normalise();
                this.vVel.mul(.75);
                break;
            default:
                break;
        }
    }

    //----------------------------------------------------------------
    //Usage : Draw Asteroid
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    draw() {
        this.drawAsteroid();
    }

    //----------------------------------------------------------------
    //Usage : Update asteroid position
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    move() {

        this.vPos.translate(this.vVel);
        if (outOfBounds(this.vPos)) {
            this.loop();
        }
    }

    //----------------------------------------------------------------
    //Usage : Screen Looping
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    loop() {

        if (this.vPos.y < -50) {
            this.vPos.y = ctx.height + 50;
        } else {
            if (this.vPos.y > ctx.height + 50) {
                this.vPos.y = -50;
            }
        }
        if (this.vPos.x < -50) {
            this.vPos.x = ctx.width + 50;
        } else if (this.vPos.x > ctx.width + 50) {
            this.vPos.x = -50;
        }

    }

    //----------------------------------------------------------------
    //Usage : Deal with being hit by a bullet
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    Hit(bullet) {
        if (this.vPos.dist(bullet.vPos) < this.fRadius) {
            this.isHit();
            return true;
        }
        return false;
    }

    //----------------------------------------------------------------
    //Usage : Ships use this to determine if a bullet is able to hit an asteroid
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    lookForHit(pos) {
        if (this.vPos.dist(pos) < this.fRadius) {
            return true;
        }
        return false;
    }

    //----------------------------------------------------------------
    //Usage : Deals with Asteroids hitting players
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    onHit(player) {
        
        let center = Vec2(this.vPos.x, this.vPos.y);
        center = center.translate(Vec2(this.fRadius * 2, 0));
        
        if (center.dist(player) < this.fRadius *2 ) {
            this.isHit();
            return true;
        }
        return false;
    }

    //----------------------------------------------------------------
    //Usage : Used to break the asteroid up into chunks. Currently a bit uppity, and wasn't worth fixing for this iteration
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    isHit() {
        this.bSplit = true;

        if (this.nSize == 1) {
            return;
        }
    }

    //----------------------------------------------------------------
    //Usage : Draws the actual asteroid
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    drawAsteroid() {
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(this.vPos.x, this.vPos.y);
        ctx.lineTo(this.vPos.x + 20 * this.nSize, this.vPos.y - 12 * this.nSize);
        ctx.lineTo(this.vPos.x + 35 * this.nSize, this.vPos.y);
        ctx.lineTo(this.vPos.x + 40 * this.nSize, this.vPos.y + 15 * this.nSize);
        ctx.lineTo(this.vPos.x + 35 * this.nSize, this.vPos.y + 30 * this.nSize);
        ctx.lineTo(this.vPos.x + 20 * this.nSize, this.vPos.y + 45 * this.nSize);
        ctx.lineTo(this.vPos.x + 5 * this.nSize, this.vPos.y + 45 * this.nSize);
        ctx.lineTo(this.vPos.x - 10 * this.nSize, this.vPos.y + 20 * this.nSize);
        ctx.lineTo(this.vPos.x, this.vPos.y);
        ctx.stroke(); 
    }
}
