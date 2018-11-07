class Bullet {

    constructor(x, y, r, playerSpeed) {
        
        this.vPos;
        this.vVel;

        this.fSpeed = 10;
        this.bOff = false;
        this.nLifespan = 60;


        this.vPos = Vec2(x, y);
        this.vVel = Vec2(x * r, y * r);
        this.vVel.mul(this.fSpeed + this.playerSpeed);
    }

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

    draw() {
        if (!this.bOff) {
            ctx.fillStyle = "black";
            ctx.arc(this.vPos.x, this.vPos.y, 3, 0, Math.PI * 2, false);
        }
    }

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
