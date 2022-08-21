const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = .9;

class Sprite {
   constructor({position, velocity, color = 'red', offset}) {
     this.position = position;
     this.velocity = velocity;
     this.width = 50;
     this.height = 150;
     this.lastKey
     this.attackBox = {
       position: {
        x: this.position.x,
        y: this.position.y
      },
      offset,
      width: 100,
      height: 50
     }
     this.isAttacking
     this.color = color
     this.health = 100;
   }

   draw() {
     c.fillStyle = this.color;
     c.fillRect(this.position.x, this.position.y, this.width, this.height);

     // attackBox
     if (this.isAttacking) {
       c.fillStyle = 'green';
       c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
     }

   }

   update() {
     this.draw();
     this.attackBox.position.x = this.position.x + this.attackBox.offset.x
     this.attackBox.position.y = this.position.y

     this.position.x += this.velocity.x;
     this.position.y += this.velocity.y;

     if (this.position.y + this.height + this.velocity.y >= canvas.height) {
       this.velocity.y = 0;
     } else {
       this.velocity.y += gravity;
     }
    }

    attack() {
      this.isAttacking = true
      setTimeout(() => {
        this.isAttacking = false
      }, 100)
    }
}

const player = new Sprite({
    position: {
    x: 100,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  }
});


const enemy = new Sprite({
  position: {
    x: 900,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  }
});

enemy.draw();

console.log(player);

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

function RectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
    && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
    && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  )
}

function determineWinner({player, enemy}) {
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Tie'

  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
  }
}


let timer = 60;
function decreaseTimer() {
  if (timer>0) {
    setTimeout(decreaseTimer, 1000)
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }
  if (timer === 0) {
    document.querySelector('#displayText').style.display = 'flex'
  }
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  player.velocity.x = 0
  enemy.velocity.x = 0

  // player movement
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = - 5;
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5;
  }

  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = - 5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5;
  }

  // detect for collision
  if (
    RectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false
    enemy.health -= 20
    document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    console.log('go')
  }

  if (
    RectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false
    player.health -= 20
    document.querySelector('#playerHealth').style.width = player.health + '%'
    console.log('enemy attack succesful')
  }

  // end game if health === 0
  if(enemy.health <=0 || player.health <=0) {

  }
}

animate();

window.addEventListener('keydown', (event) => {
  console.log(event.key);
  switch(event.key) {
    case 'd':
      keys.d.pressed = true
      player.lastKey = 'd'
    break
    case 'a':
      keys.a.pressed = true
      player.lastKey = 'a'
    break
    case 'w':
      player.velocity.y = -20
    break
    case ' ':
      player.attack();
    break
    case 'ArrowRight':
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
    break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
    break
    case 'ArrowUp':
      enemy.velocity.y = -20
    break
    case 'ArrowDown':
      enemy.attack();
    break;
  }
  console.log(event.key)
});

window.addEventListener('keyup', (event) => {
  switch(event.key) {
    case 'd':
      keys.d.pressed =  false
    break
    case 'a':
      keys.a.pressed = false
    break
  }

  //enemy control keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed =  false
    break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
    break
  }
  console.log(event.key)
})
