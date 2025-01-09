let bigCircle;
let lasers;
let mouseShooter;
let gameOver = false;
let direction;
let bigCircleLasers;

function setup() {
    new Canvas(600, 600);
    displayMode('maxed');

    bigCircle = new Sprite();
    bigCircle.diameter = 200;
    bigCircle.color = 'red';

    lasers = new Group();
    lasers.image = 'assets/asteroids_bullet.png';

    bigCircleLasers = new Group();
    bigCircleLasers.image = 'assets/asteroids_bullet.png';

    mouseShooter = new Sprite(width / 2, height - 30, 20, 20);
    mouseShooter.color = 'white';

    direction = createVector(random(-1, 1), random(-1, 1)).normalize();

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

    // Check for collision between mouseShooter and bigCircleLasers
    if (mouseShooter.collides(bigCircleLasers)) {
        gameOver = true;
    }

    // Move the big circle in the current direction
    bigCircle.x += direction.x;
    bigCircle.y += direction.y;

    // Ensure the circle stays within the canvas and change direction if it hits the edge
    if (bigCircle.x <= bigCircle.diameter / 2 || bigCircle.x >= width - bigCircle.diameter / 2) {
        direction.x *= -1;
    }
    if (bigCircle.y <= bigCircle.diameter / 2 || bigCircle.y >= height - bigCircle.diameter / 2) {
        direction.y *= -1;
    }

    // Big circle shoots lasers
    if (frameCount % 60 === 0) { // Shoot a laser every second
        let bigLaser = new bigCircleLasers.Sprite(bigCircle.x, bigCircle.y, 5, 5);
        bigLaser.speed = 7;
        bigLaser.direction = random(0, 360);
    }
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
    direction = createVector(random(-1, 1), random(-1, 1)).normalize();
    gameOver = false;
}
