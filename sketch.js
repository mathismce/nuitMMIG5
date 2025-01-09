let bigCircle;
let lasers;
let mouseShooter;

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

    if (keyIsDown(90)) { // Z key
        mouseShooter.y -= 5;
    }
    if (keyIsDown(83)) { // S key
        mouseShooter.y += 5;
    }
    if (keyIsDown(81)) { // Q key
        mouseShooter.x -= 5;
    }
    if (keyIsDown(68)) { // D key
        mouseShooter.x += 5;
    }

    if (mouseIsPressed) {
        let laser = new lasers.Sprite(mouseShooter.x, mouseShooter.y, 5, 5);
        laser.speed = 10;
        laser.direction = 0;
    }

    lasers.collides(bigCircle, circleHit);
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
}

function startNewGame() {
    bigCircle.x = width / 2;
    bigCircle.y = height / 2;
    bigCircle.w = 100; // Reset the width of the circle
    bigCircle.h = 100; // Reset the height of the circle
}