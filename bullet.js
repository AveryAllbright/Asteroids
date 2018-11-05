class Bullet {

    let vPos;
    let vVel;

    let fSpeed = 10;
    let bOff = false;
    let nLifespan = 60;


    function constructor(x, y, r, playerSpeed) {
        vPos = new Vec2(x, y);
        vVel = new vec2(x * r, y * r);
        vVel.mul(fSpeed + playerSpeed);
    }

    function move() {
        nLifespan--;
        if (nLifespan < 0) {
            bOff = true;
        } else {
            vPos.translate(vVel);
            //TODO : Looping
        }
    }

    function draw() {
        if (!bOff) {
            ctx.fillStyle = "black";
            ctx.arc(vpos.x, vPos.y, 3, 0, Math.PI * 2, false);
        }
    }

    function loop() {
        //TODO : Looping
    }

}
