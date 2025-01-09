let bigCircle;
let lasers;
let mouseShooter;
let gameOver = false;

function setup() {
    new Canvas(600, 600);
    displayMode('maxed');

    bigCircle = new Sprite();
    bigCircle.diameter = 200;
    bigCircle.color = 'red';

    lasers = new Group();
    lasers.image = 'assets/asteroids_bullet.png';

    mouseShooter = new Sprite(width / 2, height - 30, 20, 20);
    mouseShooter.color = 'white';

    startNewGame();
}

function draw() {
    background(0);

    if (gameOver) {
        textSize(32);
        fill('white');
        textAlign(CENTER, CENTER);
        text('Game Over', width / 2, height / 2);
        return;
    }

    mouseShooter.x = mouseX;
    mouseShooter.y = mouseY;

    if (mouseIsPressed) {
        let laser = new lasers.Sprite(mouseShooter.x, mouseShooter.y, 5, 5);
        laser.speed = 10;
        laser.direction = 0;
    }

    lasers.collides(bigCircle, circleHit);

    // Check for collision between mouseShooter and bigCircle
    if (mouseShooter.collides(bigCircle)) {
        gameOver = true;
    }

    // Move the big circle to the left
    bigCircle.x -= 1;

    // Ensure the circle stays within the canvas
    bigCircle.x = constrain(bigCircle.x, bigCircle.diameter / 2, width - bigCircle.diameter / 2);
    bigCircle.y = constrain(bigCircle.y, bigCircle.diameter / 2, height - bigCircle.diameter / 2);
}

function circleHit(laser, circle) {
    laser.remove();
    circle.w -= 2; 
    circle.h -= 2; 
    if (circle.w < 0) {
        circle.w = 0; // Prevent the width from becoming negative
    }
    if (circle.h < 0) {
        circle.h = 0; // Prevent the height from becoming negative
    }
    if (circle.w === 0 && circle.h === 0) {
        gameOver = true;
    }
}

function startNewGame() {
    bigCircle.x = width - bigCircle.diameter / 2; // Start from the right
    bigCircle.y = height / 2;
    bigCircle.w = 100; // Reset the width of the circle
    bigCircle.h = 100; // Reset the height of the circle
    gameOver = false;
}
