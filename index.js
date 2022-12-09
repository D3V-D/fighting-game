const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

ctx.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7

const canvas_background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: "./img/background.png",
})

const shop = new Sprite({
    position: {
        x: 630,
        y: 159,
    },
    imageSrc: './img/shop.png',
    scale: 2.5,
    framesMax: 6,
    animationInterval: 7,
})

const player = new Fighter({
    position: {
        x: 100,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    attackBoxDimensions: {
        width: 190,
        height: 100
    },
    attackboxOffset: {
        x: 60,
        y: 20,
    },
    imageSrc: "./img/samuraiMack/Idle.png",
    framesMax: 8,
    scale: 2.5,
    animationInterval: 7,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: "./img/samuraiMack/Idle.png",
            framesMax: 8
        },
        run: {
            imageSrc: "./img/samuraiMack/Run.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "./img/samuraiMack/Jump.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "./img/samuraiMack/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "./img/samuraiMack/Attack1.png",
            framesMax: 6
        },
        takeHit: {
            imageSrc: "./img/samuraiMack/takeHitWhiteSilhouette.png",
            framesMax: 4
        },
        death: {
            imageSrc: "./img/samuraiMack/Death.png",
            framesMax: 6
        }
    }
})

const enemy = new Fighter({
    position: {
        x: canvas.width - 150,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    attackBoxDimensions: {
        width: 170,
        height: 150
    },
    attackboxOffset: {
        x: -170,
        y: 0
    },
    
    color: "blue",
    imageSrc: "./img/kenji/Idle.png",
    framesMax: 4,
    scale: 2.5,
    animationInterval: 7,
    offset: {
        x: 215,
        y: 170
    },
    sprites: {
        idle: {
            imageSrc: "./img/kenji/Idle.png",
            framesMax: 4
        },
        run: {
            imageSrc: "./img/kenji/Run.png",
            framesMax: 8,
        },
        jump: {
            imageSrc: "./img/kenji/Jump.png",
            framesMax: 2,
        },
        fall: {
            imageSrc: "./img/kenji/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imageSrc: "./img/kenji/Attack1.png",
            framesMax: 4
        },
        takeHit: {
            imageSrc: "./img/kenji/TakeHit.png",
            framesMax: 3
        },
        death: {
            imageSrc: "./img/kenji/Death.png",
            framesMax: 7
        }
    }
})


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)

    //clears bg
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
        
    //updates
    canvas_background.update()
    shop.update()
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    ctx.fillRect(0, 0, canvas.width, canvas.height - 92)
    player.update()
    enemy.update()


    player.velocity.x = 0

    

    //player movement
    if (keys.a.pressed && player.lastKey == 'a' && player.position.x > 0) {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey == 'd' && player.position.x + player.width < 1024) {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        //player base image
        player.switchSprite('idle')
    }

    //jump animation
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }


    enemy.velocity.x = 0

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft' && enemy.position.x > 0) {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight' && enemy.position.x + enemy.width < 1024) {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    //jump animation
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }

    //detect collisions
    if (rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking && player.framesCurrent == 4) {
        if (enemy.health > 0 && player.health > 0 && timer_time != 0) {
            enemy.takeHit(20)
            healthBar(enemy, '#enemy-health')
        }
        player.isAttacking = false
    }
    
    //if player misses
    if(player.isAttacking && player.framesCurrent == 4) {
        player.isAttacking = false
    }

    //detect enemy collisions
    if (rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking) {
        if (player.health > 0 && enemy.health > 0 && timer_time != 0) {
            player.takeHit(5)
            healthBar(player, '#player-health')
        }
        enemy.isAttacking = false
    }

    //if enemy misses
    if(enemy.isAttacking && enemy.framesCurrent == 2) {
        enemy.isAttacking = false
    }

    //detect hp hitting 0 (end game)
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy, timerId})
    }

    

}

animate()


//listens for key presses
window.addEventListener('keydown', (e) => {
    if (!player.dead) {
        switch (e.key) {
            //p1
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                if (player.position.y + player.height > canvas.height - 94) {
                    player.velocity.y = -20
                } 
                break
            case 's':
                player.attack()
                break
            }
    }
    if (!enemy.dead){
        switch (e.key) {
            //p2
            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break
            case 'ArrowUp':
                //dont allow jumps if above ground
                if (enemy.position.y + enemy.height > canvas.height - 94) {
                    enemy.velocity.y = -20
                }
                break
            case 'ArrowDown':
                enemy.attack()
                break
        }
    }
})

window.addEventListener('keyup', (e) => {
    //player1 keys
    switch (e.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }

    //enemy keys
    switch (e.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
})
