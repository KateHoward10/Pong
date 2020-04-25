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
		player2.setAttribute('y', +player2.getAttribute('y') - BALL_DIAMETER);
	} else if (event.keyCode === 40) {
		player2.setAttribute('y', +player2.getAttribute('y') + BALL_DIAMETER);
	}
}

function moveMouse(event) {
	if (event.clientY < canvas.height - PLAYER_HEIGHT) {
		player2.setAttribute('y', event.clientY);
	}
}

let direction = Math.random() > 0.5 ? 'right' : 'left';
let yOffset = Math.random() * 10 - 5;

function resetBall() {
	ball.setAttribute('x', GAME_WIDTH / 2 - BALL_RADIUS);
	ball.setAttribute('y', GAME_HEIGHT / 2 - BALL_RADIUS);
}

function ballMove() {
	const currentX = +ball.getAttribute('x');
	const currentY = +ball.getAttribute('y');
	const player1X = +player1.getAttribute('x');
	const player1Y = +player1.getAttribute('y');
	const player2X = +player2.getAttribute('x');
	const player2Y = +player2.getAttribute('y');
	if (
		currentX + BALL_DIAMETER === player2X &&
		player2Y <= currentY + BALL_DIAMETER &&
		currentY <= player2Y + PLAYER_HEIGHT
	) {
		direction = 'left';
		setMyScore(myScore + 1);
	}
	if (currentX + BALL_DIAMETER === GAME_WIDTH) {
		setComputerScore(computerScore + 1);
		setTimeout(resetBall, 100);
	}
	if (
		currentX === player1X + BALL_DIAMETER &&
		player1Y <= currentY + BALL_DIAMETER &&
		currentY <= player1Y + PLAYER_HEIGHT
	) {
		setComputerScore(computerScore + 1);
		direction = 'right';
	}
	if (currentX === 0) {
		setMyScore(myScore + 1);
		setTimeout(resetBall, 100);
	}



	ball.setAttribute('y', currentY + yOffset);
	if (direction === 'left') {
		ball.setAttribute('x', currentX - 2);
	} else {
		ball.setAttribute('x', currentX + 2);
	}
	requestAnimationFrame(ballMove);
}

document.addEventListener('keydown', keyPress);
document.addEventListener('mousemove', moveMouse);
