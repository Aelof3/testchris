
var myGamePiece;
var myObstacles = [];
var myScore;
var myGameArea;

function startGame() {
    myGameArea = new gamearea();
    myGamePiece = new component(40, 30, "bluefish.png", 10, 120, "image");
    myGamePiece.gravity = 0.05;
    myScore = new component("14px", "Consolas", "black", 0, 10, "text");
    myGameArea.start();
}


function gamearea() {
    this.canvas = document.createElement("canvas");
    
    this.start = function() {
        this.canvas.width = 300;
        this.canvas.height = 280;    
        document.getElementById("canvaswrapper").appendChild(this.canvas);
        this.context = this.canvas.getContext("2d");
        this.frameNo = 0;
        this.coralfreq = 150;
        this.lastcoral = 1;
        updateGameArea();
    }
    this.stop = function() {
        clearInterval(this.interval);
        this.pause = true;
    }    
    this.clear = function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}


function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            if (!this.text) {this.text = "SCORE: 0";}
            ctx.fillText(this.text, this.x, this.y);
        } else if (type == "image") {
            ctx.drawImage(this.image,
              this.x,
              this.y,
              this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitTop();
        this.hitBottom();
    }
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.hitTop = function() {
        if (this.y <= 1){
            this.gravitySpeed = 1;
            this.y = 1;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
        //return false;
    }
}

function getCoralColor(){
    var colors = [
        "#f36e63",
        "#f99e24",
        "#de7c3f",
        "#f8a269",
        "#f48d9c",
        "#e75883",
        "#ea82a6",
        "#a34d79"
    ]
    return colors[Math.floor(Math.random() * colors.length)]
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap, coralcolor;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            return;
        } 
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;
    var intervalfreq = myGameArea.coralfreq * (Math.pow(0.5,myGameArea.frameNo/2000));
    if (myGameArea.frameNo == 1 || everyinterval(intervalfreq)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 100;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 75;
        maxGap = 100;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        
        coralcolor1 = getCoralColor();
        coralcolor2 = getCoralColor();

        myObstacles.push(new component(25, height, coralcolor1, x, 0));
        myObstacles.push(new component(25, x - height - gap, coralcolor2, x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += (-1 - (myGameArea.frameNo / 1000));
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    //if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    if (myGameArea.frameNo > (n + myGameArea.lastcoral)) {
        myGameArea.lastcoral = n + myGameArea.lastcoral;
        return true;
    }
    return false;
}

function accelerate(n) {
    if (!myGameArea.interval) {myGameArea.interval = setInterval(updateGameArea, 20);}

    myGamePiece.gravity = n;
}

function restartgame(x) {
    myGameArea.stop();
    myObstacles = [];
    //myGameArea = undefined;
    document.getElementById("canvaswrapper").innerHTML = "";
    startGame();
}

window.addEventListener('keydown', function (e) {
    if (e.keyCode == 65){
        accelerate(-0.5);
    }
})
window.addEventListener('keyup', function (e) {
    if (e.keyCode == 65){
        accelerate(0.2);
    } else if (e.keyCode == 82){
        restartgame();
    }
})
