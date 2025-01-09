let sprite;
let gravity = 0.75;
let velocityY = 0;
let jumpStrength = -20; // Increase this value for a higher jump
let isOnGround = false;


function setup() {
    new C2 = new Sprite(100, height - (height / 4), 200, 10, 'static');
    zqd
}

function update() {
    clear();

    if (keyIsDown(90) && isOnGround) { // 'Z' key
        velocityY = jumpStrength; // Apply jump strength
        isOnGround = false; // The sprite is now in the air
    }
    if (keyIsDown(81)) { // 'Q' key
        sprite.x -= 5;
    }
    if (keyIsDown(83)) { // 'S' key
        sprite.y += 5;
    }
    if (keyIsDown(68)) { // 'D' key
        sprite.x += 5;
    }


    // Apply gravity
    velocityY += gravity;
    sprite.y += velocityY;

    // Check for collision with the floor
    if (sprite.y + sprite.height / 2 > floor.y - floor.height / 2 &&
        sprite.y - sprite.height / 2 < floor.y + floor.height / 2 &&
        sprite.x + sprite.width / 2 > floor.x - floor.width / 2 &&
        sprite.x - sprite.width / 2 < floor.x + floor.width / 2) {
        // Collision detected, adjust position and velocity
        sprite.y = floor.y - floor.height / 2 - sprite.height / 2;
        velocityY = 0;
        isOnGround = true; // The sprite is on the ground
    } else if (sprite.y + sprite.height / 2 > floor2.y - floor2.height / 2 &&
        sprite.y - sprite.height / 2 < floor2.y + floor2.height / 2 &&
        sprite.x + sprite.width / 2 > floor2.x - floor2.width / 2 &&
        sprite.x - sprite.width / 2 < floor2.x + floor2.width / 2) {
        // Collision detected with floor2, adjust position and velocity
        sprite.y = floor2.y - floor2.height / 2 - sprite.height / 2;
        velocityY = 0;
        isOnGround = true; // The sprite is on the ground
    } else {
        isOnGround = false; // The sprite is in the air
    }

}
let projectiles = [];

function mousePressed() {
    let projectile = new Sprite(sprite.x, sprite.y, 10, 10);
    projectile.color = 'red';
    projectile.targetX = mouseX;
    projectile.targetY = mouseY;
    let angle = atan2(mouseY - sprite.y, mouseX - sprite.x);
    projectile.velocityX = cos(angle) * 10;
    projectile.velocityY = sin(angle) * 10;
    projectiles.push(projectile);
}

function updateProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        p.x += p.velocityX;
        p.y += p.velocityY;

        // Remove projectile if it goes off screen
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
            projectiles.splice(i, 1);
        }
    }
}

function update() {
    clear();

    if (keyIsDown(90) && isOnGround) { // 'Z' key
        velocityY = jumpStrength; // Apply jump strength
        isOnGround = false; // The sprite is now in the air
    }
    if (keyIsDown(81)) { // 'Q' key
        sprite.x -= 5;
    }
    if (keyIsDown(83)) { // 'S' key
        sprite.y += 5;
    }
    if (keyIsDown(68)) { // 'D' key
        sprite.x += 5;
    }

    // Apply gravity
    velocityY += gravity;
    sprite.y += velocityY;

    // Check for collision with the floor
    if (sprite.y + sprite.height / 2 > floor.y - floor.height / 2 &&
        sprite.y - sprite.height / 2 < floor.y + floor.height / 2 &&
        sprite.x + sprite.width / 2 > floor.x - floor.width / 2 &&
        sprite.x - sprite.width / 2 < floor.x + floor.width / 2) {
        // Collision detected, adjust position and velocity
        sprite.y = floor.y - floor.height / 2 - sprite.height / 2;
        velocityY = 0;
        isOnGround = true; // The sprite is on the ground
    } else if (sprite.y + sprite.height / 2 > floor2.y - floor2.height / 2 &&
        sprite.y - sprite.height / 2 < floor2.y + floor2.height / 2 &&
        sprite.x + sprite.width / 2 > floor2.x - floor2.width / 2 &&
        sprite.x - sprite.width / 2 < floor2.x + floor2.width / 2) {
        // Collision detected with floor2, adjust position and velocity
        sprite.y = floor2.y - floor2.height / 2 - sprite.height / 2;
        velocityY = 0;
        isOnGround = true; // The sprite is on the ground
    } else {
        isOnGround = false; // The sprite is in the air
    }

    updateProjectiles();
} anvas();

sprite = new Sprite();
sprite.width = 50;
sprite.height = 50;

floor = new Sprite(100, height - 10, 200, 10, 'static');
floor.width = width;
floor.x = width / 2;

floor