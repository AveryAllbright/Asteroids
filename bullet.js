//Bullets are used by the ship to destroy asteroids

class Bullet {

    //----------------------------------------------------------------
    //Usage : Generates a new Bullet
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    constructor(x, y, r, playerSpeed) {
        this.fSpeed = 10.0;
        this.bOff = false;
        this.nLifespan = 60;
        this.vPos = Vec2(x, y);
        this.vVel = Vec2(1, 0);
        this.vVel = this.vVel.rotate(r);
        this.vVel = this.vVel.mul((this.fSpeed + playerSpeed));
    }

    //----------------------------------------------------------------
    //Usage : Moves the Bullet and increments its lifespan timer
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    move() {
        this.nLifespan--;
        if (this.nLifespan < 0) {
            this.bOff = true;
        } else {
            this.vPos.translate(this.vVel);
            if (outOfBounds(this.vPos)) {
                this.loop();
            }
        }
    }

    //----------------------------------------------------------------
    //Usage : draws the bullet
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
    draw() {
        if (!this.bOff) {
            ctx.strokeStyle = 'white';
            ctx.beginPath();
            ctx.arc(this.vPos.x, this.vPos.y, 3, 0, Math.PI * 2, false);
            ctx.stroke();
        }
    }

    //----------------------------------------------------------------
    //Usage : Deals with Screen looping
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
}
