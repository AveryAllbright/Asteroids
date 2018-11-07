let humanPlayer;
let pop;
let nSpeed = 100;
let fGlobalMuteChance = .01;

let bShowBest = true; //Show the best of the previous generation only
let bRunBest = false; // only show best pilot of all time
let bHumanPlaying = true; //allow user interaction with gameplay
let width;
let height;
let canvas = document.getElementById("mainCanvas");;
let ctx = canvas.getContext('2d', {
        alpha: false
    });

function setUp() {

    ctx.width = window.innerWidth;
    ctx.height = window.innerHeight;
    width = ctx.width;
    height = ctx.height;


    humanPlayer = new Player(width, height);
    pop = new Population(200);
    draw();
}

function updateCanvasSize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  requestAnimationFrame(draw);
}
updateCanvasSize();
window.addEventListener('resize', updateCanvasSize);


function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);

    //Three play states : human driven, most fit, and evolutionary

    //---------------------------------------------------------------------------------------------------------
    //Human Run
    if (bHumanPlaying) {
        if (!humanPlayer.bDead) {
            humanPlayer.update();
            humanPlayer.draw();
        } else {
            bHumanPlaying = false;
        }
    }

    //----------------------------------------------------------------------------------------------------------
    //Best Run
    else {
        if (bRunBest) {
            if (!pop.bestPlayer.dead) {
                pop.bestPlayer.look();
                pop.bestPlayer.think();
                pop.bestPlayer.update();
                pop.bestPlayer.draw();
            } else {
                bRunBest = false;
                pop.bestPlayer = pop.bestPlayer.cloneForReplay();
            }
        }
        //--------------------------------------------------------------------------------------------------
        //Fitness Test
        else {
            if (!pop.done()) {
                pop.updateAlive();

            } else {
                pop.calculateFitness();
                pop.naturalSelection();
            }
        }

    }

    showScore();
    requestAnimationFrame(draw);

}


//----------------------------------------------------------------------------------------
//Keyboard controls for human player

window.onkeydown = function(key) {
        
    switch (key.key) {
        //------------------------------------------------------------------------
        //non direct playing control inputs 
        case ' ':
            if (bHumanPlaying) {
                humanPlayer.shoot();
            }
            break;
        case 'p':
            bHumanPlaying = !bHumanPlaying;
            humanPlayer = new Player();
            break;
        case 'h':
            fGlobalMuteChance /= 2;
            break;
        case 'd':
            fGlobalMuteChance *= 2;
            break;
        case 'b':
            bRunBest = true;
            break;

            //------------------------------------------------------------------------
            //Movement Controls
        case 'w':
            humanPlayer.bBooster = true;
            break;
        case 'a':
            humanPlayer.fSpin = .05;
            break;
        case 's':
            humanPlayer.fSpin = .05;
            break;

    }
}

window.onkeyup = function(key) {
    switch (key.key) {
        case 'w':
           humanPlayer.bBooster = false;
            break;
        case 'a':
            humanPlayer.fSpin = 0;
            break;
        case 's':
            humanPlayer.fSpin = 0;
            break;
    }
}

//----------------------------------------------------------------------------
// Quality of Life Code

function outOfBounds(pos) {
    if (pos.y < -50 || pos.y < -50 || pos.x > width + 50 || pos.y > 50 + height) {
        return true;
    }
    return false;
}


function showScore() {
    //ehhhhhhhhhhhhhhhhhhhhhh TODO : this I guess. 
}

window.onload = setUp();
