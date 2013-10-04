d = document;

function drawbox(x, y, color) {

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(10 * x, 10 * y, 10, 10);

}

function drawapple() {

     xApple = 1 * (Math.floor(Math.random() * 49) + 1);
     yApple = 1 * (Math.floor(Math.random() * 49) + 1);     //pick a random place
     for(var i=0;i<sizeSnake;i++) {
       if (xSnake[i] == xApple && ySnake[i] == yApple) {
         drawapple(); //if we're in the snake start over
       }
     }
     
     drawbox(xApple,yApple, "#ea0b29"); //candy apple red
     
}

function drawsnake() {

     for (var i=0;i<sizeSnake;i++) {
     drawbox(xSnake[i],ySnake[i], "#65b388");      //draw his whole body in our lovely sea serpent green 
     }
     drawbox(xSnake[0],ySnake[0], "#ffffff");     //erase his last link     
}

//check what's coming for our snake
function checksnake(x, y) {

  var myButt = 0;
  for (var i=1;i<sizeSnake;i++) {
    if (xSnake[sizeSnake] == xSnake[i] && ySnake[sizeSnake] == ySnake[i])     {myButt = 1;}
  }
  return myButt;    

}

//arrow keypress handler
document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '38' && travelY != 1) {
        travelY = -1; //north
        travelX = 0;
    }
    else if (e.keyCode == '40' && travelY != -1) {
        travelY = 1; //south
        travelX = 0;
    }
    else if (e.keyCode == '37' && travelX != 1) {
        travelX = -1; //west
        travelY = 0;
    }
    else if (e.keyCode == '39' && travelX != -1) {
        travelX = 1; //east
        travelY = 0
    }

}


// Initial setup on page load
d.addEventListener("DOMContentLoaded", function () {
d.removeEventListener("DOMContentLoaded", arguments.callee, false);
 nowPlaying = 0;
 initPlay ();    
});


    initPlay = function() {
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 510, 510);
    dead = 0; //we start off alive!
    xSnake = [0,1,2,3];
    ySnake = [2,2,2,2]; //and in the top left corner
    sizeSnake = 3; //at the ripe young size of 2 ;D
    travelX = 1; //and traveling east
    travelY = 0;
    drawapple();
    if (nowPlaying == 0) {
      nowPlaying = 1; 
      mainloop();
    }
    }


//mainloop

          mainloop = function() {
          
            myButt = checksnake ();
            drawsnake();
            xSnake.push(xSnake[sizeSnake] + travelX);
            ySnake.push(ySnake[sizeSnake] + travelY);
            
            if (xSnake[sizeSnake] == xApple && ySnake[sizeSnake] == yApple) { 
              sizeSnake = sizeSnake + 1; 
              drawapple(); 
            } 
            else {
              xSnake.shift();
              ySnake.shift(); //if we didn't grab an apple trim the snake so he stays the right size
            }

            if (xSnake[sizeSnake] > 51 || xSnake[sizeSnake] < -1 || ySnake[sizeSnake] > 51 || ySnake[sizeSnake] < -1 || myButt == 1) { 
              dead = 1; 
              nowPlaying = 0; 
            }
            
            if (dead == 0) {
              var t = setTimeout(function () {
                mainloop()
              }, 50)          
            } //if we're alive run it again!

          }




