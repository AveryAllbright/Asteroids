class Asteroid {

    constructor(posX, posY, velX, velY, size) {


        this.vPos;
        this.vVel;

        this.nSize;
        this.fRadius;

        this.lChunks = [];
        this.bSplit = false;

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
                this.fRadius = 20;
                this.vVel.normalise();
                this.vVel.mul(1.0);
                break;
            case 3:
                this.fRadius = 40;
                this.vVel.normalise();
                this.vVel.mul(.75);
                break;
            default:
                break;
        }
    }

    draw() {

        this.drawAsteroid();
    }

    move() {

        this.vPos.translate(this.vVel);
        if (outOfBounds(this.vPos)) {
            this.loop();
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

    Hit(bullet) {
        if (this.vPos.dist(bullet.vPos) < this.fRadius) {
            this.isHit();
            return true;
        }
        return false;
    }

    lookForHit(pos) {
        if (this.vPos.dist(pos) < this.fRadius) {
            return true;
        }
        return false;
    }

    onHit(player) {
        if (this.vPos.dist(player) < this.fRadius + 2) {
            this.isHit();
            return true;
        }
        return false;
    }

    isHit() {
        this.bSplit = true;

        if (this.nSize == 1) {
            return;
        }

       
    }


    drawAsteroid() {
        ctx.strokeStyle = "white";
        ctx.beginPath();
        ctx.moveTo(this.vPos.x, this.vPos.y);
        ctx.lineTo(this.vPos.x + 20, this.vPos.y - 12);
        ctx.lineTo(this.vPos.x + 35, this.vPos.y);
        ctx.lineTo(this.vPos.x + 40, this.vPos.y + 15);
        ctx.lineTo(this.vPos.x + 35, this.vPos.y + 30);
        ctx.lineTo(this.vPos.x + 20, this.vPos.y + 45);
        ctx.lineTo(this.vPos.x + 5, this.vPos.y + 45);
        ctx.lineTo(this.vPos.x - 10, this.vPos.y + 20);
        ctx.lineTo(this.vPos.x, this.vPos.y);
        ctx.stroke();
    }





}
