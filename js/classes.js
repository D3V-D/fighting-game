class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, animationInterval = 10, offset = {x: 0, y: 0}}) {
        this.position = position
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = animationInterval // change frame every x actual frames
        this.offset = offset
    }

    draw() {
        ctx.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax), //crop x start
            0, //crop y start
            this.image.width / this.framesMax, //crop x end
            this.image.height, // crop y end
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale,
        )
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold == 0) { //if frames elapsed is divisble by the delay
            if (this.framesCurrent < this.framesMax - 1){
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }


    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({position, velocity, attackBoxDimensions = {width: 100, height: 100}, attackboxOffset = {x: 0, y: 0}, color = 'red', imageSrc, scale = 1, framesMax = 1, animationInterval = 10,  offset = {x: 0, y: 0}, sprites}) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            animationInterval,    
            offset
        })
        
        this.attackBoxDimensions = attackBoxDimensions
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            attackboxOffset,
            width: this.attackBoxDimensions.width,
            height: this.attackBoxDimensions.height,
        }
        this.color = color
        this.isAttacking;
        this.health = 100

        this.sprites = sprites

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }

        this.dead = false
    }

    update() {
        this.draw()
        if (!this.dead){
            this.animateFrames()
        }
        

        this.attackBox.position.x = this.position.x + this.attackBox.attackboxOffset.x
        this.attackBox.position.y = this.position.y + this.attackBox.attackboxOffset.y

        //draw the attack box
        //ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        //gravity function
        if(this.position.y + this.height + this.velocity.y >= canvas.height - 92) {
            this.velocity.y = 0
            this.position.y = 334.6
        } else {
            this.velocity.y += gravity
        }
    }

    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true
    }

    takeHit(dmg){
        this.health -= dmg

        if (this.health <= 0) {
            this.switchSprite('death')
        } else {
            this.switchSprite('takeHit')
        }
    }

    switchSprite(sprite){
        
        if (sprite == 'reset-idle') {
            this.framesCurrent = 0
            this.image = this.sprites.idle.image
            this.framesMax = this.sprites.idle.framesMax
            this.dead = false
        }   

        if (this.image == this.sprites.death.image) {
            if (this.framesCurrent == this.sprites.death.framesMax - 1)
                this.dead = true
            return
        }

        if (this.image == this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1 && sprite != 'death') return
        if (this.image == this.sprites.takeHit.image && sprite != 'death' && sprite != 'attack1') {
            if (this.framesCurrent < this.sprites.takeHit.framesMax - 1) return
        }

        switch(sprite){
            case 'idle':
                if (this.image !== this.sprites.idle.image){
                    this.framesCurrent = 0
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image){
                    this.framesCurrent = 0
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image){
                    this.framesCurrent = 0
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image){
                    this.framesCurrent = 0
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image){
                    this.framesCurrent = 0
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image){
                    this.framesCurrent = 0
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image){
                    this.framesCurrent = 0
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                }
                break;
        }
    }
}
