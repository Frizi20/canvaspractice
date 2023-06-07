const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')


canvas.width  = 600;
canvas.height = canvas.width / (16/9);

window.addEventListener('resize', function () {
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;
});

ctx.fillStyle = '#212121';
ctx.fillRect(0, 0, canvas.width, canvas.height);






class Pallete{
	constructor(x,y, width, height){
		this.x = x
		this.y = y
		this.width = width
		this.height = height
	}

	draw(){
		ctx.beginPath()
		ctx.fillStyle = '#2f2f2f'
		ctx.rect(this.x, this.y, this.height, this.width);
		ctx.fill();

	}
}


const pallete = new Pallete(
	canvas.height / 2,
	canvas.innerHeight - 50,
	5,
	100
)





function animate(){

	ctx.clearRect(0,0, window.innerWidth, window.innerHeight)
	ctx.fillStyle = '#212121';
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	
	ctx.beginPath()
	ctx.fillStyle = '#2f2f2f'
	ctx.rect(0, 10, 50, 50);
	ctx.fill();

	pallete.draw()

	requestAnimationFrame(animate)
}

animate()