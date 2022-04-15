let socket = io();

class color{
	constructor(r,g,b){
		var tr = ("0"+ r.toString(16)).slice(-2);
		var tg = ("0"+ g.toString(16)).slice(-2);
		var tb = ("0"+ b.toString(16)).slice(-2);
		this.C = '#' + tr + tg + tb;
	}
}
dotcolors = [
	new color(255,0,0),
	new color(228,114,0),
	new color(180,180,0),
	new color(114,228,0),
	new color(0,255,0),
	new color(0,228,114),
	new color(0,180,180),
	new color(0,114,228),
	new color(0,0,255),
	new color(114,0,228),
	new color(180,0,180),
	new color(228,0,114),
	new color(0,0,0),
	new color(147,147,147),
	new color(255,255,255),
	new color(0,0,0),
	new color(0,0,0),
];
black = dotcolors[12];

class frame{
	constructor(X,Y){
		this.data = [];
		this.w = X;
		this.h = Y;
		for(var y=0;y<Y;y++){
			var buf = [];
			for(var x=0;x<X;x++){
				buf.push(black);
			}
			this.data.push(buf);
		}
	}
	clear(){
		for(y=0;y<this.h;y++){
			for(x=0;x<this.w;x++){
				this.data[y][x] = black;
			}
		}
	}
}

class animation{
	constructor(){
		this.w = 16;
		this.h = 16;
		this.frames = [];
		this.frames.push(new frame(16,16));
		this.activeFrame = 0;
		this.framerate = 1;
		this.length = 1;
	}
	addFrame(){
		this.frames.push(new frame(16,16));
		this.activeFrame += 1;
		this.length += 1;
	}
	copyFrame(){
		this.addFrame();
		for(var x = 0;x < this.w;x++){
			for(var y = 0;y < this.h;y++){
				this.frames[this.length-1].data[y][x] = this.frames[this.length-2].data[y][x];
			}
		}
	}
	clearFrame(){
		this.active.clear();
	}
	deleteFrame(){
		if(this.length <= 1){return false;}
		this.frames.splice(this.activeFrame,1);
		this.length -= 1;
	}
	changeFramerate(fr){
		this.framerate = fr;
	}
	changeActive(f){
		this.activeFrame = f;
	}
	get active(){
		return this.frames[this.activeFrame];
	}
}

ANIM = new animation();
synced = true;
colorpickerdata = [
[dotcolors[0],dotcolors[1]],
[dotcolors[2],dotcolors[3]],
[dotcolors[4],dotcolors[5]],
[dotcolors[6],dotcolors[7]],
[dotcolors[8],dotcolors[9]],
[dotcolors[10],dotcolors[11]],
[dotcolors[12],dotcolors[13]],
[dotcolors[14],dotcolors[15]],
];
const canv = document.getElementById("canvas");
canv.height =(Math.min(window.innerHeight*4/5,window.innerWidth*4/5))-20;
canv.height = parseInt(canv.height / 16) * 16;
canv.width = canv.height;
const colorPick = document.getElementById("colors");
colorPick.width = canv.width/4;
colorPick.height = canv.width;

const colorctx = colorPick.getContext("2d");
colorctx.lineWidth = 2;

const ctx = canvas.getContext("2d");

prevX = 0;
prevY = 0;

activeColor = dotcolors[0];


function drawFrame(){
	sideLen = (canv.width/16);
	for(var y=0;y<16;y++){
		for(var x=0;x<16;x++){
			ctx.fillStyle = ANIM.active.data[y][x].C;
			ctx.fillRect(x * sideLen,y * sideLen,sideLen,sideLen);
		}
	}
}



var T = document.getElementById("target");
T.onchange = function(){
	var t = T.value;
	var response = socket.send(JSON.stringify(["setup", 0, t]));
}

socket.on("message", (m)=>{
	message = JSON.parse(m);
	if(message[0] == "response"){
		if(message[1] == "binding"){
			if(!message[2]){
				T.value = "";
				alert("failed to bind to light");
			}
		}
});

async function playAnimation(){
	var delay = 1000 / ANIM.framerate;
	saved_frame = ANIM.activeFrame;
	ANIM.activeFrame = 0;
	for(var i=0;i<ANIM.length;i++){
		setTimeout(()=>{drawFrame();ANIM.activeFrame+=1;},delay*i);
	}
	setTimeout(()=>{ANIM.activeFrame = saved_frame;drawFrame()},(delay*i)+10);
}

function drawColorPick(index){
	sideLen = (canv.width/8);
	for(y=0;y<8;y++){
		for(x=0;x<2;x++){
			colorctx.fillStyle = colorpickerdata[y][x].C;
			colorctx.fillRect(x * sideLen,y * sideLen, sideLen, sideLen);
		}
	}
	x = index % 2;
	y = (index - x) / 2;
	colorctx.beginPath();
	colorctx.rect(x * sideLen, y * sideLen, sideLen, sideLen);
	colorctx.stroke();
}
drawColorPick(0);

isDrawing = false;
isErasing = false;

resetCanv(ctx);

canv.addEventListener("contextmenu", (e) => event.preventDefault());
window.addEventListener("resize", (e) => {
	newDim = (Math.min(window.innerHeight*4/5,window.innerWidth*4/5))-20;
	newDim = parseInt(newDim/16)*16;
	canv.height = newDim;
	canv.height = parseInt(canv.height / 16) * 16;
	canv.width = canv.height;
	colorPick.width = canv.width/4;
	colorPick.height = canv.width;
	drawFrame();
});

canv.addEventListener("mousemove", (e) => {
	if(isDrawing){
		pixel_x = parseInt(16 * e.clientX/canv.width);
		pixel_y = parseInt(16 * e.clientY/canv.width);
		pixel_x = Math.min(15,pixel_x);
		pixel_y = Math.min(15,pixel_y);
		ANIM.active.data[pixel_y][pixel_x] = activeColor;
		if(synced){
		socket.send(JSON.stringify(["lighting","spot",pixel_y,pixel_x,activeColor.C]));
		}
	}
	else if(isErasing){
		pixel_x = parseInt(16 * e.clientX/canv.width);
		pixel_y = parseInt(16 * e.clientY/canv.width);
		pixel_x = Math.min(15,pixel_x);
		pixel_y = Math.min(15,pixel_y);
		ANIM.active.data[pixel_y][pixel_x] = black;
		if(synced){
		socket.send(JSON.stringify(["lighting","spot",pixel_y,pixel_x,black.C]));
		}
	}
	drawFrame();
});

canv.addEventListener("mousedown", (e) => {
	if(e.button){
		isErasing = true;
	} else{
		isDrawing = true;
	}
	
});
window.addEventListener("mouseup", (e) => {
	isDrawing = false;
	isErasing = false;
	picking = false;
});

canv.addEventListener("touchstart",(e) => {
	isDrawing = true;
	prevX = e.targetTouches[0].clientX;
	prevY = e.targetTouches[0].clientY;
});
window.addEventListener("touchend",(e) => {
	isDrawing = false;
});
canv.addEventListener("touchcancel",(e) => {
});
canv.addEventListener("touchmove",(e) => {
	if(isDrawing){
		pixel_x = parseInt(16 * e.targetTouches[0].clientX/canv.width) * parseInt(canv.width / 16);
		pixel_y = parseInt(16 * e.targetTouches[0].clientY/canv.width) * parseInt(canv.width / 16);
		ctx.fillRect(pixel_x,pixel_y,parseInt(canv.width / 16), parseInt(canv.width / 16));
	}
	e.preventDefault();
});


canv.addEventListener("click", (e) => {
	pixel_x = parseInt(16 * e.clientX/canv.width);
	pixel_y = parseInt(16 * e.clientY/canv.width);
	pixel_x = Math.min(15,pixel_x);
	pixel_y = Math.min(15,pixel_y);
	ANIM.active.data[pixel_y][pixel_x] = activeColor;
	if(synced){
		socket.send(JSON.stringify(["lighting","spot",pixel_y,pixel_x,activeColor.C]));
		//socket.send(JSON.stringify(["lighting","fill",ANIM]));
	}
});

function resetCanv(context){
	buf = ctx.fillStyle;
	context.fillStyle = "black";
	context.fillRect(0,0,canv.width,canv.width);
	ctx.fillStyle = buf;
}

picking = false;
colorPick.addEventListener("click", (e) => {
	pixel_x = parseInt(e.offsetX/colorPick.width * 2);
	pixel_y = parseInt(e.clientY/colorPick.height*8);
	pixel_x = Math.min(1,pixel_x);
	pixel_y = Math.min(7,pixel_y);
	activeColor = dotcolors[pixel_y * 2 + pixel_x];
	drawColorPick(pixel_y * 2 + pixel_x);
});
colorPick.addEventListener("mousemove", (e) => {
	if(picking){
		pixel_x = parseInt(e.offsetX/colorPick.width * 2);
		pixel_y = parseInt(e.clientY/colorPick.height*8);
		pixel_x = Math.min(1,pixel_x);
		pixel_y = Math.min(7,pixel_y);
		activeColor = dotcolors[pixel_y * 2 + pixel_x];
		drawColorPick(pixel_y * 2 + pixel_x);
	}
});
colorPick.addEventListener("mousedown", (e) => {
	picking = true;
});
colorPick.addEventListener("mouseup", (e) => {
	
});
var buttons = [document.getElementById("new_frame"),document.getElementById("last_frame"),document.getElementById("next_frame")]
buttons[0].addEventListener("click", (e) => {
	ANIM.addFrame();
	drawFrame();
});
buttons[1].addEventListener("click", (e) => {
	ANIM.activeFrame = Math.max(0,ANIM.activeFrame - 1);
	drawFrame();
});
buttons[2].addEventListener("click", (e) => {
	ANIM.activeFrame = Math.min(ANIM.length - 1, ANIM.activeFrame + 1)
	drawFrame();
});

