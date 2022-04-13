const canv = document.getElementById("canvas");
canv.height = Math.min(800,Math.min(window.innerHeight,window.innerWidth));
canv.width = canv.height;

const colorPick = document.getElementById("colors");
colorPick.width = canv.width/8;
colorPick.height = canv.width;

colorPick.getContext("2d").fillStyle = "#f00";
colorPick.getContext("2d").fillRect(0,0,1000,1000);

const ctx = canvas.getContext("2d");

window.addEventListener("resize", (e) => {
	canv.height = Math.min(800,Math.min(window.innerHeight,window.innerWidth));
	canv.width = canv.height;
	colorPick.width = canv.width/8;
	colorPick.height = canv.width;
});

ctx.fillStyle = "#f08";

isDrawing = false;
isErasing = false;

resetCanv(ctx);

canv.addEventListener("contextmenu", (e) => event.preventDefault());

function rgbToC(r,g,b){
	r = ("0"+parseInt(r).toString(16)).slice(-2);
	g = ("0"+parseInt(g).toString(16)).slice(-2);
	b = ("0"+parseInt(b).toString(16)).slice(-2);
	return "#"+r+g+b;
}

canv.addEventListener("mousemove", (e) => {
	if(isDrawing){
		pixel_x = parseInt(16 * e.clientX/canv.width) * parseInt(canv.width / 16);
		pixel_y = parseInt(16 * e.clientY/canv.width) * parseInt(canv.width / 16);
		ctx.fillRect(pixel_x,pixel_y,parseInt(canv.width / 16), parseInt(canv.width / 16));
	}
	else if(isErasing){
		buf = ctx.fillStyle;
		ctx.fillStyle = "black";
		pixel_x = parseInt(16 * e.clientX/canv.width) * parseInt(canv.width / 16);
		pixel_y = parseInt(16 * e.clientY/canv.width) * parseInt(canv.width / 16);
		ctx.fillRect(pixel_x,pixel_y,parseInt(canv.width / 16), parseInt(canv.width / 16));
		ctx.fillStyle = buf;
	}
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
});

canv.addEventListener("touchstart",(e) => {
	e.preventDefault();
	isDrawing = true;
});
canv.addEventListener("touchend",(e) => {
	isDrawing = false;
});
canv.addEventListener("touchcancel",(e) => {
	console.log('a');
});
canv.addEventListener("touchmove",(e) => {
	if(isDrawing){
		pixel_x = parseInt(16 * e.clientX/canv.width) * parseInt(canv.width / 16);
		pixel_y = parseInt(16 * e.clientY/canv.width) * parseInt(canv.width / 16);
		ctx.fillRect(pixel_x,pixel_y,parseInt(canv.width / 16), parseInt(canv.width / 16));
	}
});



canv.addEventListener("click", (e) => {
	buf = ctx.fillStyle;
	ctx.fillStyle = "#0f0";
	pixel_x = parseInt(16 * e.clientX/canv.width) * parseInt(canv.width / 16);
	pixel_y = parseInt(16 * e.clientY/canv.width) * parseInt(canv.width / 16);
	ctx.fillRect(pixel_x,pixel_y,parseInt(canv.width / 16), parseInt(canv.width / 16));
	ctx.fillStyle = buf;
});

function drawCursor(){

}

function resetCanv(context){
	buf = ctx.fillStyle;
	context.fillStyle = "black";
	context.fillRect(0,0,canv.width,canv.width);
	ctx.fillStyle = buf;
}
