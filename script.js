const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const BALL_DIAMETER = 20;
const BALL_RADIUS = BALL_DIAMETER / 2;
const PLAYER_HEIGHT = 100;

const game = document.getElementById('game');
game.setAttribute('width', GAME_WIDTH);
game.setAttribute('height', GAME_HEIGHT);

const player1 = document.getElementById('player1');
player1.setAttribute('width', BALL_DIAMETER);
player1.setAttribute('height', PLAYER_HEIGHT);
player1.setAttribute('x', BALL_DIAMETER * 2);
player1.setAttribute('y', GAME_HEIGHT / 2 - PLAYER_HEIGHT / 2);

const ball = document.getElementById('ball');
ball.setAttribute('width', BALL_DIAMETER);
ball.setAttribute('height', BALL_DIAMETER);
ball.setAttribute('x', GAME_WIDTH / 2 - BALL_RADIUS);
ball.setAttribute('y', GAME_HEIGHT / 2 - BALL_RADIUS);

const player2 = document.getElementById('player2');
player2.setAttribute('width', BALL_DIAMETER);
player2.setAttribute('height', PLAYER_HEIGHT);
player2.setAttribute('x', GAME_WIDTH - BALL_DIAMETER * 3);
player2.setAttribute('y', GAME_HEIGHT / 2 - PLAYER_HEIGHT / 2);

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

function movePlayer1() {
	const player1Y = +player1.getAttribute('y');
	if (player1Y <= PLAYER_HEIGHT) {
		player1.setAttribute('y', player1Y + BALL_DIAMETER);
	} else if (player1Y >= GAME_HEIGHT - PLAYER_HEIGHT) {
		player1.setAttribute('y', player1Y - BALL_DIAMETER);
	} else {
		player1.setAttribute('y', Math.random() > 0.5 ? player1Y + BALL_DIAMETER : player1Y - BALL_DIAMETER);
	}
}

function keyPress(event) {
	if (event.keyCode === 38) {
		player2.setAttribute('y', +player2.getAttribute('y') - BALL_DIAMETER);
	} else if (event.keyCode === 40) {
		player2.setAttribute('y', +player2.getAttribute('y') + BALL_DIAMETER);
	} else if (event.keyCode === 32) {
		ballMove();
		setInterval(movePlayer1, 1000);
	}
}

function moveMouse(event) {
	if (event.clientY < GAME_HEIGHT - PLAYER_HEIGHT) {
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

	if (currentY <= 0 || currentY >= GAME_HEIGHT - BALL_DIAMETER) {
		yOffset = -1 * yOffset;
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
