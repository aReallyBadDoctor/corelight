const http = require('http');
const fs = require('fs');
const ws = require('ws');

const port = process.env.PORT || 3000;


const ping_payload = ['ping'];

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({port:8081});
wss.on('connection', ((ws) => {
	ws.on('message', (message) => {
		console.log('message:' + message);
	});
	ws.on('end', ()=>{
		console.log("connection ended");
	});
}));

/*http.createServer((req,res) => {
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
}).listen(port);*/