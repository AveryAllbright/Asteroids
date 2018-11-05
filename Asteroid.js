class Asteroid {

    let vPos;
    let vVel;

    let nSize = 3;
    let fRadius;

    let lChunks = [];
    let bSplit = false;

    const canvas = document.getElementById("mainCanvas");
    const ctx = canvas.getContext('2d', {
        alpha: false
    });


    function constructor(posX, posY, velX, velY, size) {
        vPos = new Vec2(posX, posY);
        nSize = size;
        vVel = new Vec2(velX, velY);

        switch (nSize) {
            case 1:
                fRadius = 10;
                vVel.normalize();
                vVel.mul(1.25);
                break;
            case 2:
                fRadius = 20;
                vVel.normalize();
                vVel.mul(1.0);
                break;
            case 3:
                fRadius = 40;
                vVel.normalize();
                vVel.mul(.75);
                break;
            default:
                break;
        }
    }

    function draw() {
        if (bSplit) {
            lChunks.forEach(Element => {
                draw();
            });
        } else {
            ctx.strokeStyle = "white";
            ctx.strokeRect(vPos.x, vPos.y, fRadius, fRadius);
        }
    }

    function move() {
        if (bSplit) {
            lChunks.forEach(Element => {
                move();
            });
        } else {
            vPos.translate(vVel);
            if (outOfBounds(vPos)) {
                loop();
            }
        }
    }

    function loop() {

        if (vPos.y < -50) {
            vPos.y = height + 50;
        } else {
            if (vPos.y > height + 50) {
                vPos.y = -50;
            }
        }
        if(vPos.x < -50)
            {
                vPos.x = width + 50;
            }
        else if(vPos.x > width + 50)
            {
                vPos.x = -50;
            }

    }

    function Hit(bullet) {
        if(vPos.dist(bullet.vPos) < fRadius)
            {
                isHit();
                return true;
            }
        return false;
    }

    function onHit(player) {
       if(vPos.dist(player.vPos) < fRadius + 15)
            {
                isHit();
                return true;
            }
        return false;
    }

    function isHit() {
        bSplit = true;
        
        if(nSize == 1){return;}
        
        vVel = new Vec2(vVel.x, vVel.y);
        vVel.rotate(-.3);
        lChunks.add(new Asteroid(vPos.x, vPos.y, vVel.x, vVel.y, nSize -1));
        vVel.rotate(.5);
        lChunks.add(new Asteroid(vPos.x, vPos.y, vVel.x, vVel.y, nSize-1));
    }
}
