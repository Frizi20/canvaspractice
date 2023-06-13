/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const canvasRect = canvas.getBoundingClientRect();
const mouse = {
    x: undefined,
    y: undefined
};

let moveWithMouse = false;

canvas.width = 600;
canvas.height = canvas.width / (16 / 9);

window.addEventListener('mousemove', (e) => {
    // mouse.x =  canvasRect.left - e.clientX ;
    // mouse.y =   e.clientY ;
    // console.log('--------')
    // console.log(e.clientY);
    // console.log(canvasRect.y)

    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

ctx.fillStyle = '#212121';
ctx.fillRect(0, 0, canvas.width, canvas.height);

class Tool {
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    static degInRad(deg) {
        const oneRadDeg = 360 / (Math.PI * 2);
        const oneDegInRad = 1 / oneRadDeg;

        return oneDegInRad * deg;
    }
}

class Pallete {
    constructor(width, height, x, y) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 5;
        this.floatHeight = 35;
        this.LEFT = false;
        this.RIGHT = false;

        if (!x) {
            this.x = canvas.width / 2 - this.width / 2;
        }

        if (!y) {
            this.y = canvas.height - this.floatHeight;
        }

        this.initialState = {
            x: this.x
        };

        document.addEventListener('keydown', this.move.bind(this));
        document.addEventListener('keyup', this.stop.bind(this));
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = '#2f2f2f';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }

    update() {
        if (this.RIGHT && this.x + this.width <= canvas.width) {
            this.x += this.speed;
        }

        if (this.LEFT && this.x >= 0) {
            this.x -= this.speed;
        }

        this.draw();
    }

    move(e) {
        if (e.key === 'ArrowLeft' && this.x > 10) {
            // this.x -= this.speed;
            this.LEFT = true;
        }
        if (e.key === 'ArrowRight' && this.x + this.width < canvas.width - 10) {
            // this.x += this.speed;
            this.RIGHT = true;
        }
    }

    stop(e) {
        if (e.key === 'ArrowLeft') {
            // this.xd = 0;
            this.LEFT = false;
        }
        if (e.key === 'ArrowRight') {
            // this.xd = 0;
            this.RIGHT = false;
        }
    }

    reset() {
        this.x = this.initialState.x;
    }
}

class Ball {
    speed = 0.5;
    gameOver = false;
    gameIsWon = false;

    constructor(pallete) {
        this.color = '#292929';
        this.radius = 10;
        this.x = pallete.x + pallete.width / 2;

        this.y = 10;
        this.y = pallete.y - pallete.height - 10;

        this.angleRad = 1;
        // this.xd = this.speed;
        // this.yd = this.speed;

        this.xd = this.speed * Math.cos(Tool.degInRad(120));
        this.yd = this.speed * Math.sin(Tool.degInRad(120));
        //store initial values

        // console.log(this.angleRad);

        this.initialState = {
            x: this.x,
            y: this.y,
            xd: this.speed,
            yd: this.speed
        };

        this.pallete = pallete;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

    showBallSpeed() {
        ctx.font = '12px Arial';
        ctx.fillStyle = '#a3a3a3';
        ctx.textAlign = 'center';
        ctx.fillText(
            'ball speed: ' + this.speed.toFixed(2),
            canvas.width / 2,
            20,
            200
        );
    }

    update() {
        if (this.gameOver) {
            this.endGame();
            return;
        }

        if (this.gameIsWon) {
            this.winGame();
            return;
        }

        if (!moveWithMouse) {
            this.x += this.xd;
            this.y -= this.yd;

            //Side walls collision
            if (
                this.x + this.radius >= canvas.width ||
                this.x - this.radius <= 0
            ) {
                this.xd = -this.xd;
            }

            //Top wall collision
            if (this.y - this.radius < 0) {
                this.yd = -this.yd;
            }

            //Check if ball falls

            if (this.y - this.radius > canvas.height) {
                this.gameOver = true;
            }
        } else {
            this.x = mouse.x;
            this.y = mouse.y;
        }

        this.palleteCollision();
        this.showBallSpeed();
        this.draw();
    }

    winGame() {
        this.yd = 0;
        this.xd = 0;

        ctx.font = '60px Veranda';
        ctx.fillStyle = '#313131';
        ctx.textAlign = 'center';
        ctx.fillText('You win!!!', canvas.width / 2, canvas.height / 2);
    }

    endGame() {
        this.yd = 0;
        this.xd = 0;

        ctx.font = '60px Veranda';
        ctx.fillStyle = '#313131';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    }

    palleteCollision() {
        //check if ball hits the pallete
        if (
            this.y + this.radius >= pallete.y &&
            this.y - this.radius < pallete.y + pallete.height &&
            this.x > pallete.x &&
            this.x < pallete.x + pallete.width
        ) {
            const deg =
                ((this.pallete.width + this.pallete.x - this.x) /
                    this.pallete.width) *
                360;

            this.xd = this.speed * Math.cos(Tool.degInRad(deg));
            this.xd = this.speed * Math.sin(Tool.degInRad(deg));

            this.yd = -this.yd;
        }
    }

    checkFall() {
        if (this.y > canvas.height + this.radius) {
            this.reset();
            pallete.reset();
        }
    }

    reset() {
        this.x = this.initialState.x;
        this.y = this.initialState.y;
        this.xd = this.initialState.xd;
        this.yd = this.initialState.yd;
    }
}

class Brick {
    static allBricks = [];
    margin = 10;
    marginTop = 30;
    bricksPerRow = 8;
    brickHeight = 20;
    brickGap = 2;
    // colors = ['#3a3a3a','#292929','#242424']
    colors = ['#272727', '#313131', '#383838'];
    gameLost = false;
    isBroken = false;

    constructor(ball, hits) {
        this.height = this.brickHeight;
        this.ball = ball;
        this.hits = hits;
        this.color = this.colors[hits - 1];

        this.placeBrick();
    }

    checkBottomCol() {
        const brickCenter = {
            x: this.x + this.width / 2,
            y: this.y + this.height / 2
        };
    }

    checkBallCollision() {
        if (
            this.ball.y - this.ball.radius < this.y + this.height &&
            this.ball.y + this.ball.radius > this.y &&
            this.ball.x + this.ball.radius > this.x &&
            this.ball.x - this.ball.radius < this.x + this.width
        ) {
            //Check brick side collision

            if (this.ball.x < this.x) {
                // console.log('left')
                this.ball.xd = -Math.abs(this.ball.xd);
            }

            if (this.ball.x > this.x + this.width) {
                // console.log('right')
                this.ball.xd = Math.abs(this.ball.xd);
            }

            if (this.ball.y < this.y) {
                // console.log('top')
                this.ball.yd = Math.abs(this.ball.yd);
            }

            if (this.ball.y > this.y + this.height) {
                // console.log('bottom')

                this.ball.yd = -Math.abs(this.ball.yd);
            }

            this.hit();
        } else {
            // console.log('not iet')
        }
    }

    placeBrick() {
        const bricks = Brick.allBricks;
        //place first brick
        if (bricks.length < 1) {
            this.x = this.margin + this.brickGap / 2;
            this.y = this.marginTop;
        } else {
            //if previous it was the last on his row
            if (bricks.length % this.bricksPerRow === 0) {
                this.x = this.margin + this.brickGap / 2;
                this.y = bricks.at(-1).y + this.brickHeight + this.brickGap;
            } else {
                const lastBrick = bricks.at(-1);
                this.x = lastBrick.x + lastBrick.width + this.brickGap;
                this.y = lastBrick.y;
            }
        }

        // if(Brick.allBricks.indexOf((bricks.at(-1)) + 1 ) % 6 === 0){
        // 	console.log(['new row'])
        // }

        Brick.allBricks.push(this);
        this.width =
            (canvas.width - this.margin * 2) / this.bricksPerRow -
            this.brickGap;
    }

    hit() {
        // this.ball.speed += 0.1;

        if (this.hits > 1) {
            this.hits--;
            this.color = this.colors[this.hits - 1];
            return;
        }

        this.break();
    }

    break() {
        this.isBroken = true;
    }

    draw() {
        if (!this.gameLost) {
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.fill();
        }
    }

    update() {
        if (this.gameIsWon()) {
            this.ball.gameIsWon = true;
            return;
        }

        if (this.isBroken) return;

        this.checkBallCollision();
        this.draw();
    }

    gameIsWon() {
        return Brick.allBricks.filter((brick) => !brick.isBroken).length === 0;
    }
}

const pallete = new Pallete(100, 10);
const ball = new Ball(pallete);
// const brick = new Brick();

// const bricks = new Array(8 * 6).fill(0).map(() => new Brick(ball, 3));

let bricks = [];

for (let i = 0; i < 8 * 5; i++) {
    let brickHits = 1;

    // if (i % 3 == 0) {
    //     brickHits = 2;
    // }

    // if (i % 5 == 0) {
    //     brickHits = 3;
    // }

    const brick = new Brick(ball, brickHits);

    bricks.push(brick);
}

function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = '#212121';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    pallete.update();
    ball.update();

    Brick.allBricks.forEach((brick) => brick.update());

    // Brick.allBricks.at(-4).checkBottomCol()

    requestAnimationFrame(animate);
}

animate();
