function rectangularCollision({ rectangle1, rectangle2}) {
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width 
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y 
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height)
}


function determineWinner( {player, enemy, timerId} ) {
    clearTimeout(timerId)
    document.getElementById('winner-overall-container').style.display = 'flex'
    if(player.health == enemy.health) {
        document.getElementById('winner').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        document.getElementById('winner').innerHTML = 'Player 1 Wins'
    } else if (player.health < enemy.health) {
        document.getElementById('winner').innerHTML = 'Player 2 Wins'
    }
}

function playAgain(){
    timer_time = 61
    decreaseTimer()
    enemy.health = 100
    player.health = 100
    document.querySelector('#enemy-health').style.width = enemy.health + '%'
    document.querySelector('#player-health').style.width = player.health + '%'
    document.querySelector('#enemy-health').style.background = 'green'
    document.querySelector('#player-health').style.background =  'green'
    document.getElementById('winner-overall-container').style.display = 'none'

    enemy.position.x = canvas.width - 150
    player.position.x = 100

    enemy.switchSprite('reset-idle')
    player.switchSprite('reset-idle')
}

function startGame(){
    playAgain()
    document.getElementById("start-screen").style.display = 'none'
}

function showMenu(){
    playAgain()
    document.getElementById('start-screen').style.display = 'flex'
}

function controls(){
    document.getElementById("controls-popup").style.display = 'flex'
}

function closeControls(){
    document.getElementById("controls-popup").style.display = 'none'
}

let timer_time = document.getElementById('timer').innerHTML
let timerId
//decreases time and checks at 0 who wins
function decreaseTimer() {
    if(timer_time > 0) {
        timer_time --
        document.getElementById('timer').innerHTML = timer_time
        timerId = setTimeout(decreaseTimer, 1000)
    }

    if (timer_time == 0){
        determineWinner({player, enemy, timerId})
    }       
}


function healthBar(character, healthbar_Id){
    if (character.health < 70 && character.health > 39) {
        document.querySelector(healthbar_Id).style.background = '#efcc00'
    } else if (character.health < 40) {
        document.querySelector(healthbar_Id).style.background = 'red'
    } else {
        document.querySelector(healthbar_Id).style.background = 'green'
    }
    document.querySelector(healthbar_Id).style.width = character.health + '%'
}