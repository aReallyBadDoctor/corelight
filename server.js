const http = require('http');
const fs = require('fs');
const WebSocketServer = require('ws').Server;


const port = process.env.PORT || 3000;

var hs = http.createServer((req,res) => {
	const fp = __dirname + (req.url === '/' ? '/index.html' : req.url);
	fs.readFile(fp, (err, data) => {
		if (err) {
			res.writeHead(404);
			res.end(JSON.stringify(err));
			return;
		}
		res.writeHead(200);
		res.end(data);
	});
});

var wss = new WebSocketServer(hs);
wss.on('connection', ((ws) => {
	console.log("client connected");
	ws.on('message', (message) => {
		console.log('message:' + message);
	});
	ws.on('end', ()=>{
		console.log("connection ended");
	});
}));
wss.on('listening', ()=>{console.log('WSS listening on port',config.get('port'))});
wss.on('error', (e)=>{console.log("WSS error:", e);});
hs.on('error', (e)=>{console.log("HS error:",e)});
hs.listen(port);
