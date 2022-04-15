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

var wss = new WebSocketServer({server:hs});
connections = {};
wss.on('connection', ((ws,req) => {
	var userID = (new Date()).getTime().toString(16);
	
	console.log("userID ", userID, " connected");
	
	connections[userID] = {socket: ws};
	ws.send(JSON.stringify(userID));
	ws.on('message', (message) => {
		var data = JSON.parse(message);
		if(data[0] == "response"){
			return true;
		}
		else if(data[0] == "lighting"){
			connections[connections[userID].target].ws.send(JSON.stringify("HELLO"));
		}
		else if(data[0] == "setup"){
			if(data[1] == "light"){
			}
			else{
				console.log(data[2]);
				connections[userID].target = data[2];
			}
		}
		console.log(data);
	});
	ws.on('end', ()=>{
		delete connections[userID];
		console.log("userID ", userID, " disconnected");
	});
}));
wss.on('listening', ()=>{console.log('WSS listening on port',port)});
wss.on('error', (e)=>{console.log("WSS error:", e);});
hs.on('error', (e)=>{console.log("HS error:",e)});
hs.listen(port);
