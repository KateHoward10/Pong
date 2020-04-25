const BALL_DIAMETER = 20;
const BALL_RADIUS = BALL_DIAMETER / 2;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 100;

class Vec {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

class Rect {
  constructor(width, height) {
    this.pos = new Vec;
    this.size = new Vec(width, height);
  }
  get left() {
    return this.pos.x - BALL_RADIUS;
  }
  get right() {
    return this.pos.x + BALL_RADIUS;
  }
  get top() {
    return this.pos.y - BALL_RADIUS;
  }
  get bottom() {
    return this.pos.y + BALL_RADIUS;
  }
}

class Ball extends Rect {
  constructor() {
    super(BALL_DIAMETER, BALL_DIAMETER);
    this.vel = new Vec;
  }
}

class Player extends Rect {
  constructor() {
    super(PLAYER_WIDTH, PLAYER_HEIGHT);
    this.score = 0;
  }
}

class Pong {
  constructor(canvas) {
    this._canvas = canvas;
    this._context = canvas.getContext('2d');

    this.ball = new Ball;
    
    this.ball.pos.x = 20;
    this.ball.pos.y = 20;
    this.ball.vel.x = 100;
    this.ball.vel.y = 100;

    this.players = [
      new Player,
      new Player
    ];

    this.players[0].pos.x = 40;
    this.players[1].pos.x = this._canvas.width - 40;
    this.players.forEach(player => {
      player.pos.y = this._canvas.height / 2 - PLAYER_HEIGHT / 2;
    })

    let lastTime;

    const callback =(milliseconds) => {
      if (lastTime) {
        this.update((milliseconds - lastTime) / 1000);
      }
      lastTime = milliseconds;
      requestAnimationFrame(callback);
    }
    callback();
  }

  collide(player, ball) {
    if (player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {
      ball.vel.x = -ball.vel.x;
    }
  }

  draw() {
    this._context.fillStyle = '#111';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    
    this.drawRect(this.ball);

    this.players.forEach(player => this.drawRect(player));
  }

  drawRect(rect) {
    this._context.fillStyle = '#fff';
    this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
  }

  update(dt) {
    // Change ball's position relative to the time difference
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;
    
    // Reverse velocity if ball bounces on the top or bottom
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y;
    }
    
    // Reverse velocity if ball bounces on the left or right
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      this.ball.vel.x = -this.ball.vel.x;
    }

    // Computer player always follows the ball
    this.players[1].pos.y = this.ball.pos.y;
    this.players.forEach(player => this.collide(player, this.ball));

    this.draw();
  }
}

const canvas = document.getElementById('game');
const pong = new Pong(canvas);

const myScoreBox = document.getElementById('myScore');
const computerScoreBox = document.getElementById('computerScore');

let myScore = 0;
let computerScore = 0;

setMyScore(0);
setComputerScore(0);

function setMyScore(score) {
	myScore = score;
	myScoreBox.textContent = myScore;
}

function setComputerScore(score) {
	computerScore = score;
	computerScoreBox.textContent = computerScore;
}

function keyPress(event) {
	if (event.keyCode === 38) {
    pong.players[0].pos.y = pong.players[0].pos.y - BALL_DIAMETER;
	} else if (event.keyCode === 40) {
		pong.players[0].pos.y = pong.players[0].pos.y + BALL_DIAMETER;
	}
}

function moveMouse(event) {
	if (event.offsetY < canvas.height - (PLAYER_HEIGHT / 2)) {
		pong.players[0].pos.y = event.offsetY;
	}
}

let direction = Math.random() > 0.5 ? 'right' : 'left';
let yOffset = Math.random() * 10 - 5;

document.addEventListener('keydown', keyPress);
canvas.addEventListener('mousemove', moveMouse);
