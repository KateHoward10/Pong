const BALL_DIAMETER = 20;
const BALL_RADIUS = BALL_DIAMETER / 2;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 100;
const INITIAL_SPEED = 240;

class Vec {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  get len() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  set len(value) {
    const factor = value / this.len;
    this.x *= factor;
    this.y *= factor;
  }
}

class Rect {
  constructor(width, height) {
    this.pos = new Vec;
    this.size = new Vec(width, height);
  }
  get left() {
    return this.pos.x - this.size.x / 2;
  }
  get right() {
    return this.pos.x + this.size.x / 2;
  }
  get top() {
    return this.pos.y - this.size.y / 2;
  }
  get bottom() {
    return this.pos.y + this.size.y / 2;
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

    this.players = [new Player, new Player];

    this.players[0].pos.x = 40;
    this.players[1].pos.x = this._canvas.width - 40;
    this.players.forEach(player => {
      player.pos.y = this._canvas.height / 2;
    })

    let lastTime;

    const callback = (milliseconds) => {
      if (lastTime) {
        this.update((milliseconds - lastTime) / 1000);
      }
      lastTime = milliseconds;
      requestAnimationFrame(callback);
    }
    callback();

    // Set up images for each digit for the scores
    this.CHAR_PIXEL = 10;
    this.CHARS = [
        '111101101101111',
        '010010010010010',
        '111001111100111',
        '111001111001111',
        '101101111001001',
        '111100111001111',
        '111100111101111',
        '111001001001001',
        '111101111101111',
        '111101111001111',
    ].map(str => {
      const numCanvas = document.createElement('canvas');
      numCanvas.height = this.CHAR_PIXEL * 5;
      numCanvas.width = this.CHAR_PIXEL * 3;
      const context = numCanvas.getContext('2d');
      context.fillStyle = '#fff';
      str.split('').forEach((fill, i) => {
        if (fill === '1') {
          context.fillRect(
            (i % 3) * this.CHAR_PIXEL,
            (i / 3 | 0) * this.CHAR_PIXEL,
            this.CHAR_PIXEL,
            this.CHAR_PIXEL
          )
        }
      });
      return numCanvas;
    })

    this.reset();
  }

  collide(player, ball) {
    // Check if ball hit by player
    if (player.left < ball.right && player.right > ball.left &&
      player.top < ball.bottom && player.bottom > ball.top) {
      const len = ball.vel.len;
      ball.vel.x = -ball.vel.x;
      // Introduce some randomness to vertical velocity
      ball.vel.y += INITIAL_SPEED * (Math.random() - 0.5);
      // Increase ball's speed slightly
      ball.vel.len = len * 1.05;
    }
  }

  draw() {
    this._context.fillStyle = '#111';
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
    
    this.drawRect(this.ball);

    this.players.forEach(player => this.drawRect(player));

    this.drawScore();
  }

  drawRect(rect) {
    this._context.fillStyle = '#fff';
    this._context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y);
  }

  drawScore() {
    const align = this._canvas.width / 3;
    const CHAR_WIDTH = this.CHAR_PIXEL * 4;
    this.players.forEach((player, index) => {
      const chars = player.score.toString().split('');
      const offset = align * (index + 1) - (CHAR_WIDTH * chars.length / 2) + this.CHAR_PIXEL / 2;
      chars.forEach((char, pos) => {
        this._context.drawImage(this.CHARS[char | 0], offset + pos * CHAR_WIDTH, 20);
      })
    })
  }

  reset() {
    this.ball.pos.x = this._canvas.width / 2;
    this.ball.pos.y = this._canvas.height / 2;

    this.ball.vel.x = 0;
    this.ball.vel.y = 0;
  }

  start() {
    if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
      // Introduce some randomness to the ball's direction of travel
      this.ball.vel.x = INITIAL_SPEED * (Math.random() > 0.5 ? 1 : -1);
      this.ball.vel.y = INITIAL_SPEED * Math.random() * 2 - 1;
      // Keep its speed consistent, though
      this.ball.vel.len = INITIAL_SPEED;
    }
  }

  update(dt) {
    // Change ball's position relative to the time difference
    this.ball.pos.x += this.ball.vel.x * dt;
    this.ball.pos.y += this.ball.vel.y * dt;
    
    // Reverse velocity if ball bounces on the top or bottom
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y;
    }
    
    // Award point if ball reaches far left or right
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      const playerId = this.ball.vel.x < 0 | 0;
      this.players[playerId].score++;
      this.reset();
    }

    // Computer player always follows the ball
    this.players[1].pos.y = this.ball.pos.y;
    this.players.forEach(player => this.collide(player, this.ball));

    this.draw();
  }
}

const canvas = document.getElementById('game');
const pong = new Pong(canvas);

function keyPress(event) {
	if (event.keyCode === 38 && pong.players[0].top > 0) {
    pong.players[0].pos.y = pong.players[0].pos.y - BALL_DIAMETER;
	} else if (event.keyCode === 40 && pong.players[0].bottom < canvas.height) {
		pong.players[0].pos.y = pong.players[0].pos.y + BALL_DIAMETER;
	} else if (event.keyCode === 32) {
    pong.start();
  }
}

function moveMouse(event) {
  const scale = event.clientY / event.target.getBoundingClientRect().height;
	pong.players[0].pos.y = (canvas.height * scale) - (PLAYER_HEIGHT / 2);
}

document.addEventListener('keydown', keyPress);
canvas.addEventListener('mousemove', moveMouse);
