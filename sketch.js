let bigCircle, lasers, mouseShooter, ground;
let gravity = 0.5, velocityY = 0, jumpForce = -15, isJumping = false;
let projectiles = [];
let isMousePressed = false;
let platforms = []; // Array to hold platforms
let movingPlatform; // Variable to hold the moving platform

function setup() {
    new Canvas();
    displayMode('maxed');

    bigCircle = new Sprite(width / 2, height / 2, 100, 'static');
    bigCircle.color = 'red';
    bigCircle.health = 100; // Add health property

    lasers = new Group();
    lasers.image = 'assets/asteroids_bullet.png';

    mouseShooter = new Sprite(width / 2, height - 50, 20, 20, 'dynamic');
    mouseShooter.color = 'white';

    ground = new Sprite(width / 2, height - 10, width, 20, 'static');
    ground.color = 'blue';

    // Create static platforms
    platforms.push(new Sprite(width / 4, height - 100, 100, 20, 'static'));
    platforms.push(new Sprite(width / 2, height - 200, 100, 20, 'static'));
    platforms.push(new Sprite(3 * width / 4, height - 300, 100, 20, 'static'));

    for (let platform of platforms) {
        platform.color = 'blue';
    }

    // Create a moving platform
    movingPlatform = new Sprite(width / 2, height - 150, 150, 20, 'kinematic'); // Kinematic to allow movement
    movingPlatform.color = 'green';
    movingPlatform.direction = 1; // Initialize direction (1 for right, -1 for left)
    movingPlatform.y = height - 400;

    startNewGame();
}

function applyGravity() {
    velocityY += gravity;
    mouseShooter.y += velocityY;

    if (mouseShooter.y + mouseShooter.h / 2 > ground.y - ground.h / 2) {
        mouseShooter.y = ground.y - ground.h / 2 - mouseShooter.h / 2;
        velocityY = 0;
        isJumping = false;
    }

    for (let platform of platforms) {
        if (mouseShooter.y + mouseShooter.h / 2 > platform.y - platform.h / 2 &&
            mouseShooter.y - mouseShooter.h / 2 < platform.y + platform.h / 2 &&
            mouseShooter.x + mouseShooter.w / 2 > platform.x - platform.w / 2 &&
            mouseShooter.x - mouseShooter.w / 2 < platform.x + platform.w / 2) {
            mouseShooter.y = platform.y - platform.h / 2 - mouseShooter.h / 2;
            velocityY = 0;
            isJumping = false;
        }
    }
}

function handleMovement() {
    if (keyIsDown(90) && !isJumping) { // Z key for jump
        velocityY = jumpForce;
        isJumping = true;
    }
    if (keyIsDown(83)) mouseShooter.y = min(mouseShooter.y + 5, height - mouseShooter.h / 2); // S key
    if (keyIsDown(81)) mouseShooter.x = max(mouseShooter.x - 5, mouseShooter.w / 2); // Q key
    if (keyIsDown(68)) mouseShooter.x = min(mouseShooter.x + 5, width - mouseShooter.w / 2); // D key

    // Ensure mouseShooter stays within the canvas vertically
    mouseShooter.y = max(mouseShooter.y, mouseShooter.h / 2);
}

function handleShooting() {
    if (mouseIsPressed && !isMousePressed) {
        isMousePressed = true;
        let projectile = new Sprite(mouseShooter.x, mouseShooter.y, 10, 10);
        projectile.image = 'assets/asteroids_bullet.png';
        let angle = atan2(mouseY - mouseShooter.y, mouseX - mouseShooter.x);
        projectile.velocityX = cos(angle) * 10;
        projectile.velocityY = sin(angle) * 10;
        projectiles.push(projectile);
    } else if (!mouseIsPressed) {
        isMousePressed = false;
    }
}

function updateMovingPlatform() {
    // Move platform horizontally between two points
    let platformSpeed = 2;
    let leftLimit = width / 4; // Left boundary
    let rightLimit = (3 * width) / 4; // Right boundary

    // Update platform's horizontal position
    movingPlatform.x += platformSpeed * movingPlatform.direction;

    // Reverse direction if hitting boundaries
    if (movingPlatform.x >= rightLimit || movingPlatform.x <= leftLimit) {
        movingPlatform.direction *= -1; // Change direction
    }

    // Handle falling and landing from below or above the moving platform
    let isAbovePlatform =
        mouseShooter.y + mouseShooter.h / 2 <= movingPlatform.y - movingPlatform.h / 2 + 5 &&
        mouseShooter.y + mouseShooter.h / 2 > movingPlatform.y - movingPlatform.h / 2 - 5; // Tolerance for landing
    let isHorizontallyAligned =
        mouseShooter.x + mouseShooter.w / 2 > movingPlatform.x - movingPlatform.w / 2 &&
        mouseShooter.x - mouseShooter.w / 2 < movingPlatform.x + movingPlatform.w / 2;

    if (isHorizontallyAligned) {
        // If falling and within the vertical range of the platform, land on it
        if (velocityY > 0 && isAbovePlatform) {
            // Player is above the platform and falling, land on the platform
            mouseShooter.y = movingPlatform.y - movingPlatform.h / 2 - mouseShooter.h / 2; // Correct vertical position
            velocityY = 0; // Stop falling
            isJumping = false; // Reset jumping state
        }
        // Handle landing from below the platform
        else if (velocityY > 0 && mouseShooter.y + mouseShooter.h / 2 > movingPlatform.y - movingPlatform.h / 2) {
            // Check if the player is falling through and landing on the platform
            if (
                mouseShooter.y + mouseShooter.h / 2 <= movingPlatform.y - movingPlatform.h / 2 + 5 &&
                mouseShooter.y + mouseShooter.h / 2 > movingPlatform.y - movingPlatform.h / 2 - 5
            ) {
                mouseShooter.y = movingPlatform.y - movingPlatform.h / 2 - mouseShooter.h / 2; // Adjust the position to land on the platform
                velocityY = 0; // Stop falling
                isJumping = false; // Reset jumping state
            }
        }
    }

    // If no landing occurs, normal gravity behavior
    if (velocityY > 0 && !isAbovePlatform) {
        // Let the player continue falling if no platform detected above
        velocityY = max(velocityY, 0);
    }

    // Move player horizontally with the moving platform (if landed)
    if (velocityY === 0 && isAbovePlatform && isHorizontallyAligned) {
        mouseShooter.x += platformSpeed * movingPlatform.direction; // Horizontal movement with the platform
    }
}

function updateProjectiles() {
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        p.x += p.velocityX;
        p.y += p.velocityY;

        // Check collision with platforms
        for (let platform of platforms) {
            if (p.x + p.w / 2 > platform.x - platform.w / 2 &&
                p.x - p.w / 2 < platform.x + platform.w / 2 &&
                p.y + p.h / 2 > platform.y - platform.h / 2 &&
                p.y - p.h / 2 < platform.y + platform.h / 2) {
                p.remove(); // Remove the projectile from display
                projectiles.splice(i, 1); // Remove the projectile from the array
                break; // Exit the loop since the projectile is removed
            }
        }

        // Remove projectile if it goes out of bounds
        if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
            p.remove(); // Remove the projectile from display
            projectiles.splice(i, 1); // Remove the projectile from the array
        }
    }
}

function checkCollisions() {
    lasers.collides(bigCircle, circleHit);

    for (let i = projectiles.length - 1; i >= 0; i--) {
        let p = projectiles[i];
        if (p.collides(bigCircle)) {
            circleHit(p, bigCircle);
            projectiles.splice(i, 1);
        }
    }


}



function circleHit(projectile, circle) {
    projectile.remove();
    circle.health = max(0, circle.health - 10); // Decrease health
    let newSize = map(circle.health, 0, 100, 0, 100); // Map health to size
    circle.w = newSize;
    circle.h = newSize;
}

function drawHealthBar() {
    let healthBarWidth = width - (width / 4); // Prendre toute la largeur du canvas
    let healthBarHeight = 10;
    let healthBarX = (width - healthBarWidth) / 2; // Positionner au centre du canvas
    let healthBarY = 20; // Position en haut du canvas

    fill(255, 0, 0);
    rect(healthBarX, healthBarY, healthBarWidth, healthBarHeight);

    fill(0, 255, 0);
    rect(healthBarX, healthBarY, healthBarWidth * (bigCircle.health / 100), healthBarHeight);
}

function startNewGame() {
    bigCircle.x = width / 2;
    bigCircle.y = height / 2;
    bigCircle.w = 100;
    bigCircle.h = 100;
    bigCircle.health = 100; // Reset health
    mouseShooter.y = height - 30;
    velocityY = 0;
    isJumping = false;
}

function draw() {
    background(0);

    applyGravity();
    handleMovement();
    handleShooting();
    updateProjectiles();
    updateEnemies(); // Update enemies
    checkCollisions();
    drawHealthBar(); // Draw the health bar
    updateMovingPlatform(); // Update moving platform

    // Spawn enemies at intervals
    if (millis() - lastEnemySpawnTime > enemySpawnInterval) {
        spawnEnemy();
        lastEnemySpawnTime = millis();
    }
}