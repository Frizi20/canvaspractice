/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

ctx.fillStyle = '#212121';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let stop = false;
let isDrowing = false;

const mouse = {
    x: null,
    y: null
};

class Tool {
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

class Circle {
    static allCircles = [];

    stopBall = false;
    colors = ['#2f2f2f', '#333', '#272727'];
    isColiding = false;
    xd = Tool.random(1, 1.5);
    yd = Tool.random(1, 1.5);
    moveByMouse;
    prevColor;

    constructor(x, y, radius, moveByMouse) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = this.colors[Tool.random(0, this.colors.length - 1)];
        this.prevColor = this.color;

        this.xd *= this.randDirection();
        this.yd *= this.randDirection();

        this.moveByMouse = moveByMouse;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.rect(this.x, this.y, this.radius, this.radius);
        ctx.fill();

        if (this.moveByMouse) {
            (this.x = mouse.x), (this.y = mouse.y);
        }

        return this;
    }

    randDirection() {
        return Math.round(Math.random()) ? 1 : -1;
    }

    update() {
        if (!this.stop || !this.stopBall) {
            this.x += this.xd;
            this.y += this.yd;

            //wall collision

            if (
                this.x + this.radius >= window.innerWidth ||
                this.x - this.radius <= 0
            ) {
                this.xd = this.xd * -1;

                this.checkVelocity();
                // this.accelerate('horisontal');
            }

            if (
                this.y + this.radius >= window.innerHeight ||
                this.y - this.radius <= 0
            ) {
                this.yd *= -1;

                this.checkVelocity();
                // this.accelerate('vertical');
            }
        }

        this.detectClosest();
        this.brushCollision();
        this.draw();
    }

    accelerate(collisionPosition) {
        if (collisionPosition == 'horisontal') {
            if (Math.abs(this.yd) <= 3) {
                this.yd *= 1.2;
            }
        }

        if (collisionPosition == 'vertical') {
            if (Math.abs(this.xd) <= 3) {
                this.xd *= 1.2;
            }
        }
    }

    checkVelocity() {
        // console.log({
        // 	x: this.xd,
        // 	y: this.yd
        // })
    }

    detectClosest() {
        for (let i = 0; i < Circle.allCircles.length; i++) {
            //check if circles collide between them
            const elx = Circle.allCircles[i];
            if (elx !== this) {
                if (
                    this.getCirclesDistance(this.x, this.y, elx.x, elx.y) <
                    this.radius + elx.radius
                ) {
                    this.stop = true;
                    this.xd *= -1;
                    this.yd *= -1;
                }
            }
        }
    }

    brushCollision() {
        const brushPoints = Brush.paths.flat(1);

        brushPoints.forEach((point) => {
            const circleCenterPointDiff = this.getCirclesDistance(
                this.x,
                this.y,
                point.x,
                point.y
            );
            if (circleCenterPointDiff < this.radius + 2) {
                // if true == stuck
                if (circleCenterPointDiff < this.radiusr) {
                    this.x += this.radius * (this.xd > 0 ? 1 : -1);
                    this.d += this.radius * (this.xd > 0 ? 1 : -1);
                } else {
                    this.xd *= -1;
                    this.yd *= -1;
                }
            }
        });
    }
	//this.getCirclesDistance(this.x, this.y, elx.x, elx.y) <

    getCirclesDistance = (xpos1, ypos1, xpos2, ypos2) => {
        const result = Math.sqrt(
            Math.pow(xpos2 - xpos1, 2) + Math.pow(ypos2 - ypos1, 2)
        );
        return result;
    };

    getInstance() {
        console.log(Circle.allCircles[0] === this);
    }

    static checkCollisions() {
        for (let i = 0; i < Circle.allCircles.length; i++) {
            const elx = Circle.allCircles[i];
            if (elx !== this) {
                const sensorDistance = 0;
                if (
                    elx.x - elx.radius - (this.x + this.radius) <
                        sensorDistance &&
                    this.x - elx.x - elx.radius - this.radius <
                        sensorDistance &&
                    elx.y - elx.radius - (this.y + elx.radius) <
                        sensorDistance &&
                    this.y - elx.y - elx.radius - this.radius < sensorDistance
                ) {
                    if (!this.isColiding) {
                        this.color = this.colors[Tool.random(0, 2)];
                        this.isColiding = true;
                    }
                } else {
                    this.isColiding = false;
                }
            }
        }
    }

    static addCirlce(circleInstance) {
        this.allCircles.push(circleInstance);
    }

    static getCircles() {
        return this.allCircles;
    }
}

// Brush class for drowing on canvas

class Brush {
    static paths = [];

    color = '#2f2f2f';
    lineWith = 1;
    coords = [];
    isDrowing = false;

    constructor() {
        canvas.addEventListener('mousemove', this.storeCoords.bind(this));
        canvas.addEventListener('mousedown', this.mouseDown.bind(this));
        canvas.addEventListener('mouseup', this.mouseUp.bind(this));
    }

    mouseDown() {
        this.isDrowing = true;
        this.coords.push([]);
    }

    mouseUp() {
        this.isDrowing = false;
    }

    drawLine(x, y) {
        // set line stroke and line width
        ctx.strokeStyle = '#2f2f2f';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    storeCoords(e) {
        if (!this.isDrowing) return;

        this.coords.at(-1).push({
            x: e.clientX,
            y: e.clientY
        });

        Brush.paths = this.coords;
    }

    update() {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWith;
        ctx.lineCap = 'round';

        this.coords.forEach((paths) => {
            paths.forEach((path, index) => {
                if (index == 0) {
                    ctx.beginPath();
                    ctx.moveTo(path.x, path.y);
                } else {
                    ctx.lineTo(path.x, path.y);
                }
            });
            ctx.stroke();
        });
    }

    getCoords() {
        this.coords.forEach((paths) => {
            paths.forEach((path, index) => {
                if (index == 0) {
                    ctx.beginPath();
                    ctx.moveTo(path.x, path.y);
                } else {
                    ctx.lineTo(path.x, path.y);
                }
            });
            ctx.stroke();
        });
    }
}

for (let i = 0; i < 1; i++) {
    const circle = new Circle(
        Tool.random(100, window.innerWidth - 100),
        Tool.random(100, window.innerHeight - 100),
        // Tool.random(10, 25)
        20
    );
    Circle.addCirlce(circle);
}

const brush = new Brush();

function animate() {
    // if (stop) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = '#212121';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    brush.update();

    Circle.allCircles.forEach((circle) => {
        circle.update();
    });

    requestAnimationFrame(animate);
}

animate();
