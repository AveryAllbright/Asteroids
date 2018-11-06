class Asteroid {

    constructor(posX, posY, velX, velY, size) {


        this.vPos;
        this.vVel;

        this.nSize;
        this.fRadius;

        this.lChunks = [];
        this.bSplit = false;

        this.canvas = document.getElementById("mainCanvas");
        this.ctx = canvas.getContext('2d', {
            alpha: false
        });


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
        if (this.bSplit) {
            this.lChunks.forEach(Element => {
                draw();
            });
        } else {
            ctx.strokeStyle = "white";
            ctx.strokeRect(this.vPos.x, this.vPos.y, this.fRadius, this.fRadius);
        }
    }

    move() {
        if (this.bSplit) {
            this.lChunks.forEach(Element => {
                this.move();
            });
        } else {
            this.vPos.translate(this.vVel);
            if (outOfBounds(this.vPos)) {
                this.loop();
            }
        }
    }

    loop() {

        if (vPos.y < -50) {
            vPos.y = height + 50;
        } else {
            if (vPos.y > height + 50) {
                vPos.y = -50;
            }
        }
        if (vPos.x < -50) {
            vPos.x = width + 50;
        } else if (vPos.x > width + 50) {
            vPos.x = -50;
        }

    }

    Hit(bullet) {
        if (vPos.dist(bullet.vPos) < fRadius) {
            isHit();
            return true;
        }
        return false;
    }
    
    lookForHit(pos)
    {
          if (vPos.dist(bullet.vPos) < fRadius) {
            return true;
        }
        return false;
    }

    onHit(player) {
        if (this.vPos.dist(player) < this.fRadius + 15) {
            isHit();
            return true;
        }
        return false;
    }

    isHit() {
        bSplit = true;

        if (nSize == 1) {
            return;
        }

        vVel = new Vec2(vVel.x, vVel.y);
        vVel.rotate(-.3);
        lChunks.add(new Asteroid(vPos.x, vPos.y, vVel.x, vVel.y, nSize - 1));
        vVel.rotate(.5);
        lChunks.add(new Asteroid(vPos.x, vPos.y, vVel.x, vVel.y, nSize - 1));
    }
}
