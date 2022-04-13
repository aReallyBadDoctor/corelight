const canv = document.getElementById("canvas");
canv.height = Math.min(800,Math.min(window.innerHeight,window.innerWidth));
canv.width = canv.height;

const ctx = canvas.getContext("2d");

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
canv.addEventListener("mouseup", (e) => {
	isDrawing = false;
	isErasing = false;
});

canv.addEventListener("click", (e) => {
	pixel_x = parseInt(16 * e.clientX/canv.width) * parseInt(canv.width / 16);
	pixel_y = parseInt(16 * e.clientY/canv.width) * parseInt(canv.width / 16);
	ctx.fillRect(pixel_x,pixel_y,parseInt(canv.width / 16), parseInt(canv.width / 16));
});

function drawCursor(){

}

function resetCanv(context){
	buf = ctx.fillStyle;
	context.fillStyle = "black";
	context.fillRect(0,0,canv.width,canv.width);
	ctx.fillStyle = buf;
}
