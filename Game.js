let humanPlayer;
let pop;
let nSpeed = 100;
let fGlobalMuteChance = .01;

let bShowBest = true; //Show the best of the previous generation only
let bRunBest = false; // only show best pilot of all time
let bHumanPlayer = false; //allow user interaction with gameplay

function setUp()
{
    ctx.width = document.innerWidth;
    ctx.height = document.innerHeight;
    
    humanPlayer = new Player();
}