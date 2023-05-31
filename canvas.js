/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('#myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth / 2;
    // canvas.height = window.innerHeight
});

let stop = false;
// ctx.fillStyle = '#ccc'
// ctx.fillRect(10, 20, 150, 150)

//canvas backround

const mouse = {
    x: null,
    y: null
};

canvas.addEventListener('click', (e) => {
    mouse.x = e.pageX;
    mouse.y = e.pageY;

    const circle = new Circle(mouse.x, mouse.y, Tool.random(10, 25));
    Circle.addCirlce(circle);

    circle.draw();
    circle.detectClosest();

    // Store every build circle
});

ctx.fillStyle = '#ccc';
ctx.strokeStyle = 'red';
ctx.lineWidth = 5;

class Tool {
    static random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

class Box {}

class Circle {
    static allCircles = [];
    colors = ['#2f2f2f', '#333', '#272727'];
    pauseAnimation = false;
    isColiding = false;
    xd = 3;
    yd = 3;
    moveByMouse;
    prevColor;

    constructor(x, y, radius, moveByMouse) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = this.colors[Tool.random(0, this.colors.length - 1)];
		this.prevColor = this.color

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
        this.x += this.xd;
        this.y += this.yd;

        if (
            this.x + this.radius >= window.innerWidth ||
            this.x - this.radius <= 0
        ) {
            this.xd = this.xd * -1;
        }

        if (
            this.y + this.radius >= window.innerHeight ||
            this.y - this.radius <= 0
        ) {
            this.yd *= -1;
        }

        this.detectClosest();
        this.draw();
    }

    detectClosest() {
        for (let i = 0; i < Circle.allCircles.length; i++) {
            const elx = Circle.allCircles[i];
            if (elx !== this) {
                if (
                    this.getCirclesDistance(this.x, this.y, elx.x, elx.y) <
                    this.radius + elx.radius
                ) {
                    // this.color = this.colors[Tool.random(0, 2)];
					this.prevColor = this.color
                    this.color = 'green';
                }else{
					this.color = this.prevColor
				}
            }
        }
    }

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
        // for (let i = 0; i < Circle.allCircles.length; i++) {
        //     const elx = Circle.allCircles[i];
        //     for (let j = 0; j < Circle.allCircles.length; j++) {
        //         const ely = Circle.allCircles[j];

        //         if (elx !== ely) {
        //             const curr = arr.at(-1);
        //             const sensorDistance = 10;
        //             if (
        //                 elx.x - elx.radius - (ely.x + ely.radius) <
        //                     sensorDistance &&
        //                 ely.x - elx.x - elx.radius - ely.radius <
        //                     sensorDistance &&
        //                 elx.y - elx.radius - (ely.y + elx.radius) <
        //                     sensorDistance &&
        //                 ely.y - elx.y - elx.radius - ely.radius < sensorDistance
        //             ) {
        //                 ely.color = 'red';
        //             }
        //         }
        //     }
        // }

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

const getDistance = (xpos1, ypos1, xpos2, ypos2) => {
    const result = Math.sqrt(
        Math.pow(xpos2 - xpos1, 2) + Math.pow(ypos2 - ypos1, 2)
    );
    return result;
};

function animate() {
    if (stop) return;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fillStyle = '#212121';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    Circle.allCircles.forEach((circle) => {
        circle.update();
    });

    requestAnimationFrame(animate);
}

animate();
