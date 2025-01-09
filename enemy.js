let enemies = [];
let enemySpawnInterval = 10000; // Interval between enemy spawns in milliseconds
let lastEnemySpawnTime = 0;

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