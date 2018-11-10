let humanPlayer;    //The Active ship if a human is playing the game
let pop;            //The active generation of ships
let fGlobalMuteChance = .01; //chance that the matrix will mutate when a generation is seeded

let bShowBest = true; //Show the best of the previous generation only
let bRunBest = false; // only show best pilot of all time
let bHumanPlaying = true; //allow user interaction with gameplay
let width; //screen space
let height; //screen space
let canvas = document.getElementById("mainCanvas");;
let ctx = canvas.getContext('2d', {
        alpha: false
    });

    //----------------------------------------------------------------
    //Usage : Sets up the intitial generation of ships and spawns a human controlled ship for 1 game
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
function setUp() {

    ctx.width = window.innerWidth;
    ctx.height = window.innerHeight;
    width = ctx.width;
    height = ctx.height;

    humanPlayer = new Player(width, height);
    pop = new Population(4);
    draw();
}

//----------------------------------------------------------------
    //Usage : deals with screen space resizing
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
function updateCanvasSize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  requestAnimationFrame(draw);
}

updateCanvasSize();
window.addEventListener('resize', updateCanvasSize);


    //----------------------------------------------------------------
    //Usage : handles all code for gameplay
    //Arg   : 
    //Return:
    //----------------------------------------------------------------
function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, ctx.width, ctx.height);

    //Three play states : human driven, most fit, and evolutionary

    //----------------------------------------------------------------
    //Human Run
    if (bHumanPlaying) {
        if (!humanPlayer.bDead) {
            humanPlayer.update();
            humanPlayer.draw();
        } else {
            bHumanPlaying = false;
        }
    }

    //----------------------------------------------------------------
    //Best Run
    else {
        if (bRunBest) { //instead of running through every trial, it simply lets the best ship from that generation play forever
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
        //----------------------------------------------------------------
        //Fitness Test 
        else {
            if (!pop.done()) { //runs through every single ship in a generation to get their fitness values
                pop.updateAlivePlayers();

            } else { //Calcs the fitness level of each ship, and creates the next generation. Pop.done revereted to false
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
            humanPlayer.fSpin = -.05;
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
}

window.onload = setUp();
