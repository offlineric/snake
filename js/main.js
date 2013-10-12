d = document;

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var TO_RADIANS = Math.PI/180; 
function drawRotatedImage(image, x, y, angle) { 
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
 
	// save the current co-ordinate system 
	// before we screw with it
	ctx.save(); 
 
	// move to the middle of where we want to draw our image
	ctx.translate((10 * x) + 5,(10 * y) +5);
 
	// rotate around that point, converting our 
	// angle from degrees to radians 
	ctx.rotate(angle * TO_RADIANS);
 
	// draw it up and to the left by half the width
	// and height of the image 
	ctx.drawImage(image, -(image.width/2), -(image.height/2));
 
	// and restore the co-ords to how they were when we began
	ctx.restore(); 
}

function drawbox(x, y, color) {
  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");
  ctx.fillStyle = color;
  ctx.fillRect(10 * x, 10 * y, 10, 10);
}

function drawapple() {
  xApple = 1 * (Math.floor(Math.random() * 49) + 1);
  yApple = 1 * (Math.floor(Math.random() * 49) + 1); //pick a random place
  for (var i = 0; i < sizeSnake; i++) {
    if (xSnake[i] == xApple && ySnake[i] == yApple) {
      drawapple(); //if we're in the snake start over
    }
  }
  drawbox(xApple, yApple, "#ea0b29"); //candy apple red
}

function drawsnake() {
  for (var i = 0; i < sizeSnake; i++) {
    var segColor = "#65b388";
    if (i % 3 == 1) {var segColor = "#8fb363";}
    drawbox(xSnake[i], ySnake[i], segColor); //draw his whole body in our lovely sea serpent green 
  }
  drawbox(xSnake[0], ySnake[0], "#ffffff"); //erase his last link    
  // and draw his cute new snake head!
  drawRotatedImage(img, xSnake[sizeSnake], ySnake[sizeSnake], headAngle)
}

function movesnake () {
  travelX = newtravelX;
  travelY = newtravelY;
  var x = (xSnake[sizeSnake] + travelX) % 51;
  var y = (ySnake[sizeSnake] + travelY) % 51;
  if (x < 0) {
    x += 51;
  }
  if (y < 0) {
    y += 51;
  }
  xSnake.push(x);
  ySnake.push(y);
}

function growsnake() {
  if (xSnake[sizeSnake] == xApple && ySnake[sizeSnake] == yApple) {
    sizeSnake += 1;
    growSnake += 5;
    drawapple();
    ourScore += 1;
    document.getElementById('ourScore').innerHTML = ourScore;
  } else if (growSnake > 0) {
    sizeSnake += 1;
    growSnake -= 1;
  } else {
    xSnake.shift();
    ySnake.shift(); //if we didn't grab an apple trim the snake so he stays the right size
  }
}

function checksnake(x, y) {  //check if we hit ourself
  var myButt = 0;
  for (var i = 1; i < sizeSnake; i++) {
    if (xSnake[sizeSnake] == xSnake[i] && ySnake[sizeSnake] == ySnake[i]) {
      myButt = 1;
    }
  }
  dead = myButt;
}

document.onkeydown = checkKey; //arrow keypress handler
function checkKey(e) {
  e = e || window.event;
  if (e.keyCode == '38' && travelY != 1) {
    newtravelY = -1; //north
    newtravelX = 0;
    headAngle = 0;
  } else if (e.keyCode == '40' && travelY != -1) {
    newtravelY = 1; //south
    newtravelX = 0;
    headAngle = 180;
  } else if (e.keyCode == '37' && travelX != 1) {
    newtravelX = -1; //west
    newtravelY = 0;
    headAngle = 270;
    
  } else if (e.keyCode == '39' && travelX != -1) {
    newtravelX = 1; //east
    newtravelY = 0
    headAngle = 90;
  }
}

d.addEventListener("DOMContentLoaded", function () { // Initial setup on page load
  d.removeEventListener("DOMContentLoaded", arguments.callee, false);
  nowPlaying = 0;
  highScore = 0;
  ourScore = 0;
  img = new Image(); 
  initPlay();
});

initPlay = function () { 
  if (nowPlaying == 0) { //initialize variables for a new game if we're not playing
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 510, 510); //clear the canvas
    dead = 0; //we start off alive!
    xSnake = [0, 1, 2, 3];
    ySnake = [2, 2, 2, 2]; //and in the top left corner
    sizeSnake = 3; //at the ripe young size of 2 ;D
    growSnake = 5; //make that 5
    travelX = 1; //and traveling east
    travelY = 0; 
    newtravelX = 1; 
    newtravelY = 0;  //with a buffer so we don't get two keypresses between iterations and insta-die
    ourScore = 0;
    drawapple();
    nowPlaying = 1;
    document.body.className = "alive";
    document.getElementById('highScore').innerHTML = highScore;
    document.getElementById('ourScore').innerHTML = ourScore;
    headAngle = 90; //facing the right way
    img.src = 'res/snakeHead.gif'; //and with a living head
    mainloop();
  }
}
render = function () {drawsnake();}

mainloop = function () {
  movesnake();
  growsnake();
  checksnake();
//  drawsnake();
  if (dead == 0) {

requestAnimFrame(render)
setTimeout( mainloop, 1000 / 30 )

  } //if we're alive run it again!
  else {  
  nowPlaying = 0; 
  img.src = 'res/deadSnakeHead.gif'; //and with a dead head
  drawRotatedImage(img, xSnake[sizeSnake-1], ySnake[sizeSnake-1], headAngle)
  if (ourScore > highScore) {highScore = ourScore;}
  document.body.className = "dead";
  } //if not end the game
}
