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

    static degInRad(deg) {
        const oneRadDeg = 360 / (Math.PI * 2);
        const oneDegInRad = 1 / oneRadDeg;

        return oneDegInRad * (deg + 90);
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
    speed = 5;

    constructor(pallete) {
        this.color = '#292929';
        this.radius = 10;
        this.x = pallete.x + pallete.width / 2;

        this.y = pallete.y - pallete.height - 10;
        this.y = 10;
        
        this.angleRad = 1;
        // this.xd = this.speed;
        // this.yd = this.speed;

        this.xd = this.speed * Math.cos(Tool.degInRad(-15));
        this.yd = this.speed * Math.sin(Tool.degInRad(-15));
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

    update() {
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

        this.draw();
    }

    palleteCollision() {
        //check if ball hits the pallete
        if (
            this.y + this.radius >= pallete.y &&
            this.y - this.radius < pallete.y + pallete.height &&
            this.x > pallete.x &&
            this.x < pallete.x + pallete.width
        ) {
            //move ball down
            this.yd = -this.yd;

            //if ball hits the first 1/4 of the pallete
            if (this.x < pallete.x + pallete.width / 4) {
                console.log('left');
                this.xd = this.speed * Math.cos(Tool.degInRad(45));
                this.yd = this.speed * Math.sin(Tool.degInRad(45));
            }
			
			//if ball hits the last 1/4 of the pallete
            if (this.x > pallete.x + pallete.width / 2) {
                console.log('right');
                this.xd = this.speed * Math.cos(Tool.degInRad(-45));
                this.yd = this.speed * Math.sin(Tool.degInRad(-45));
            }

			if (this.x > pallete.x + pallete.width / 4 && this.x < pallete.x + pallete.width /2) {
				this.xd = this.speed * Math.cos(Tool.degInRad(30));
                this.yd = this.speed * Math.sin(Tool.degInRad(30));
			}

			if (this.x > pallete.x + pallete.width / 2 && this.x < pallete.x + pallete.width * .75) {
				this.xd = this.speed * Math.cos(Tool.degInRad(-30));
                this.yd = this.speed * Math.sin(Tool.degInRad(-30));
			}

			//if ball hits the center
            if (this.x > pallete.x + (pallete.width / 2) - 5 && this.x <= pallete.x + (pallete.width / 2) + 5 ) {
				console.log('center')
                this.xd = 0;
                this.xd = -this.xd;
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

	checkBottomCol(){
		
		const brickCenter = {
			x: this.x + this.width/2,
			y: this.y + this.height/2
		} 

	}

    checkBallCollision() {
        if (
            this.ball.y - this.ball.radius < this.y + this.height &&
            this.ball.y + this.ball.radius > this.y &&
            this.ball.x + this.ball.radius > this.x &&
            this.ball.x - this.ball.radius < this.x + this.width
        ) {
            
			
			// if((this.ball.y - this.ball.radius) - (this.y + this.height) - 10 < 0){
			// 	this.ball.yd = -Math.abs(this.ball.yd);
			// 	console.log('hit from the top')

			// }

			// if(this.y - (this.ball.y + this.ball.radius) < 0){
			// 	this.ball.yd = Math.abs(this.ball.yd);
			// 	console.log('hit from the bottom')
			// }

			// this.ball.xd = -this.ball.xd 
			this.ball.yd = -this.ball.yd 


            // remove brick instance from the allBricks [array]
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

	// Brick.allBricks.at(-4).checkBottomCol()

    requestAnimationFrame(animate);
}

animate();
