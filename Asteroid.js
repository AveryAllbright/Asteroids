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
            //TODO : Check for Looping
        }
    }

    function loop() {

        //TODO : Looping

    }

    function Hit(bullet) {
        //TODO : Hit detection
    }

    function onHit(player) {
        //Todo : Hit detection
    }

    function isHit() {
        //TODO : Asteroid Splitting
    }
}
