let bigCircle, lasers, mouseShooter, ground;
let gravity = 0.5, velocityY = 0, jumpForce = -15, isJumping = false;
let projectiles = [];
let isMousePressed = false;
let platforms = []; // Array to hold platforms
let enemies = [];
let enemySpawnInterval = 10000; // Interval between enemy spawns in milliseconds
let lastEnemySpawnTime = 0;


function setup() {
    new Canvas();
    displayMode('maxed');

    bigCircle = new Sprite(width / 2, height / 2, 100, 'static');
    bigCircle.color = 'red';
    bigCircle.health = 100; // Add health property

    lasers = new Group();
    lasers.image = 'assets/asteroids_bullet.png';

    mouseShooter = new Sprite(width / 2, height - 50, 20, 20, 'static');
    mouseShooter.color = 'white';

    ground = new Sprite(width / 2, height - 10, width, 20, 'static');
    ground.color = 'blue';

    // Create platforms
    platforms.push(new Sprite(width / 4, height - 100, 100, 20, 'static'));
    platforms.push(new Sprite(width / 2, height - 200, 100, 20, 'static'));
    platforms.push(new Sprite(3 * width / 4, height - 300, 100, 20, 'static'));

    for (let platform of platforms) {
        platform.color = 'blue';
    }

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
    if (keyIsDown(90) && !isJumping) { // Z key
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

function spawnEnemy() {
    let groupSize = floor(random(5, 9)); // Random number of enemies between 5 and 8
    for (let i = 0; i < groupSize; i++) {
        let enemy = new Sprite(width + 50 + i * 60, height - 60, 50, 50, 'dynamic'); // Adjusted height and spacing
        enemy.color = 'purple';
        enemy.velocityX = -2;
        enemy.velocityY = 0; // Initial vertical velocity
        enemies.push(enemy);
    }
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        let enemy = enemies[i];
        enemy.x += enemy.velocityX;
        enemy.velocityY += gravity; // Apply gravity
        enemy.y += enemy.velocityY;

        // Check collision with ground
        if (enemy.y + enemy.h / 2 > ground.y - ground.h / 2) {
            enemy.y = ground.y - ground.h / 2 - enemy.h / 2;
            enemy.velocityY = 0;
        }

        // Remove enemy if it goes out of bounds
        if (enemy.x < -50) {
            enemy.remove();
            enemies.splice(i, 1);
        }

        // Check collision with projectiles
        for (let j = projectiles.length - 1; j >= 0; j--) {
            let p = projectiles[j];
            if (p.collides(enemy)) {
                enemy.remove();
                enemies.splice(i, 1);
                p.remove();
                projectiles.splice(j, 1);
                break;
            }
        }
    }
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

    // Spawn enemies at intervals
    if (millis() - lastEnemySpawnTime > enemySpawnInterval) {
        spawnEnemy();
        lastEnemySpawnTime = millis();
    }
}