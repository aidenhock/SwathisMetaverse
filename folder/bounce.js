function Ball(x, y, radius, e, mass, colour){
    this.position = {x: x, y: y}; // m
    this.velocity = {x: 0, y: 0}; // m/s
    this.e = -e; // Coefficient of restitution, has no units
    this.mass = mass; // kg
    this.radius = radius; // m
    this.colour = colour;
    this.area = (Math.PI * radius * radius) / 10000; // m^2
}

var canvas = null;
var ballSpawnButton = null;
var ctx = null;
var fps = 1/60; // 60 FPS
var dt = fps * 1000; // ms
var timer = false;
var mouse = {x: 0, y: 0, isDown: false};
var ag = 9.81; // m/s^2 acceleration due to gravity on earth
var width = 0;
var height = 0;
var balls = [];
var circleCenter = {};
var circleRadius = 0;

function drawCircle() {
    ctx.clearRect(0, 0, width, height); // Clears the canvas
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.arc(circleCenter.x, circleCenter.y, circleRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    // If you have other elements that need to be redrawn, call their respective draw functions here.
}


var setup = function(){
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;
    circleCenter = {x: width / 2, y: height / 2};
    circleRadius = Math.min(width, height) / 2 - 10; // Subtract 10 to account for the ball radius
	document.getElementById('sizeSlider').addEventListener('input', function(e) {
		circleRadius = e.target.value;
		drawCircle(); // You may need to create this function or integrate its functionality into your code
	});
	
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;
    canvas.onmousemove = getMousePosition;
    timer = setInterval(loop, dt);
}

var mouseDown = function(e){
    if(e.which == 1){
        getMousePosition(e);
        mouse.isDown = true;
        var max = 255;
        var min = 20;
        var r = 75 + Math.floor(Math.random() * (max - min) - min);
        var g = 75 + Math.floor(Math.random() * (max - min) - min);
        var b = 75 + Math.floor(Math.random() * (max - min) - min);
        balls.push(new Ball(mouse.x, mouse.y, 10, 0.7, 10, "rgb(" + r + "," + g + "," + b + ")"));
    }
}

var mouseUp = function(e){
    if(e.which == 1){
        mouse.isDown = false;
        balls[balls.length - 1].velocity.x = (balls[balls.length - 1].position.x - mouse.x) / 10;
        balls[balls.length - 1].velocity.y = (balls[balls.length - 1].position.y - mouse.y) / 10;
    }
}

function getMousePosition(e){
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
}

function loop(){
    ctx.clearRect(0, 0, width, height);

    // Draw the circle boundary
    ctx.beginPath();
    ctx.strokeStyle = 'white';
    ctx.arc(circleCenter.x, circleCenter.y, circleRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();

    for(var i = 0; i < balls.length; i++){
        // Handling the ball collisions
        collisionCircle(balls[i]);

        // Rendering the ball
        ctx.beginPath();
        ctx.fillStyle = balls[i].colour;
        ctx.arc(balls[i].position.x, balls[i].position.y, balls[i].radius, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();

        // Update position and velocity
        balls[i].position.x += balls[i].velocity.x * fps * 100;
        balls[i].position.y += balls[i].velocity.y * fps * 100;
    }
}

function collisionCircle(ball){
    var dx = ball.position.x - circleCenter.x;
    var dy = ball.position.y - circleCenter.y;
    var distance = Math.sqrt(dx * dx + dy * dy);

    if(distance + ball.radius >= circleRadius){
        // Reflect the velocity vector across the normal to the circle at the point of collision
        var normalX = dx / distance;
        var normalY = dy / distance;
        var dot = (ball.velocity.x * normalX + ball.velocity.y * normalY) * 2;

        ball.velocity.x -= dot * normalX;
        ball.velocity.y -= dot * normalY;

        // Move the ball outside the circle boundary to prevent sticking
        var overlap = (ball.radius + distance) - circleRadius;
        ball.position.x -= overlap * normalX;
        ball.position.y -= overlap * normalY;
    }
}


// Call the setup function to initialize the game
setup();
