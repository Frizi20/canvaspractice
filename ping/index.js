/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = canvas.width / (16 / 9);

window.addEventListener('resize', function () {
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
});

ctx.fillStyle = '#212121';
ctx.fillRect(0, 0, canvas.width, canvas.height);

class Tool {
    static random(min, max) {
        return parseFloat((Math.random() * (max - min + 1) + min).toFixed(4));
    }
}

class Pallete {
    constructor(width, height, x, y) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 25;
        this.floatHeight = 35

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
        document.addEventListener('keyup', (e)=>{
            if (e.key === 'ArrowLeft' && this.x > 10) {
                this.xd = 0;
            }
            if (e.key === 'ArrowRight' && this.x + this.width < canvas.width - 10) {
                this.xd = 0;
            }
        } )
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = '#2f2f2f';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }

    update() {
        this.draw();
    }

    move(e) {
        if (e.key === 'ArrowLeft' && this.x > 10) {
            this.x -= this.speed;
        }
        if (e.key === 'ArrowRight' && this.x + this.width < canvas.width - 10) {
            this.x += this.speed;
        }
    }

    reset() {
        this.x = this.initialState.x;
    }
}

class Ball {
    speed = 1;

    constructor(pallete) {
        this.color = '#292929';
        this.radius = 10;
        this.x = pallete.x + pallete.width / 2;
        this.y = pallete.y - pallete.height - 10;
        // this.angleRad = Tool.random(0.2,0.8)
        this.angleRad = 1;
        // this.xd = this.speed;
        // this.yd = this.speed;

        this.xd = this.speed * Math.cos(Math.PI / 4);
        this.yd = this.speed * Math.sin(Math.PI / 4);
        //store initial values

        console.log(this.angleRad);

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

    update() {
        // return;
        this.x += this.xd;
        this.y -= this.yd;

        //Side walls collision
        if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
            this.xd = -this.xd;
        }

        //Top wall collision
        if (this.y - this.radius < 0) {
            this.yd = -this.yd;
        }

        this.palleteCollision();
        // this.checkFall();
        this.draw();
    }

    palleteCollision() {
        if (
            this.y + this.radius >= pallete.y &&
            this.x > pallete.x &&
            this.x < pallete.x + pallete.width
        ) {
            this.yd = -this.yd;
            if (this.x < pallete.x + pallete.width / 2) {
                this.xd = this.speed * Math.cos((Math.PI / 2) * 1.3);
                this.yd = this.speed * Math.sin((Math.PI / 2) * 1.3);
            } else if (this.x === pallete.x + pallete.width / 2) {
                this.xd = 0;
                this.xd = -this.xd;
            } else {
                this.xd = this.speed * Math.cos((Math.PI / 2) * 0.7);
                this.yd = this.speed * Math.sin((Math.PI / 2) * 0.7);
            }
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

    isBroken = false;

    constructor(ball) {
        this.color = '#292929';
        this.height = this.brickHeight;
        this.ball = ball;

        this.placeBrick();
    }

    checkBallCollision() {
        if (
            this.ball.y - this.ball.radius < this.y + this.height &&
            this.ball.y + this.ball.radius > this.y &&
            this.ball.x + this.ball.radius > this.x &&
            this.ball.x - this.ball.radius < this.x + this.width
        ) {
            this.ball.yd = this.ball.yd * -1;
            // this.ball.xd = 3
            //redirect ball
            // this.ball.yd = Math.abs(this.ball.yd)
            //remove brick instance from the allBricks [array]
            this.break();
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

    break() {
        this.isBroken = true;
        // const bricks = Brick.allBricks;
        // const currBrickIndex = bricks.indexOf(this);
        // bricks.splice(currBrickIndex, 1);
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fill();
    }

    update() {
        if (this.isBroken) return;
        this.checkBallCollision();
        this.draw();
    }
}

const pallete = new Pallete(100, 10);
const ball = new Ball(pallete);
// const brick = new Brick();

const bricks = new Array(8 * 8).fill(0).map(() => new Brick(ball));

function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = '#212121';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    pallete.update();
    ball.update();

    Brick.allBricks.forEach((brick) => brick.update());

    requestAnimationFrame(animate);
}

animate();
