const express = require('express');
const http = require('http');
const fs = require('fs');
const WebSocketServer = require('ws').Server;
const socketio = require('socket.io');

const app = express();

const port = process.env.PORT || 3000;

const hs = http.createServer(app);

var wss = socketio(hs);

connections = {};

wss.on('connection', ((ws) => {
	var userID = ("000000"+(new Date()).getTime().toString(16)).slice(-6);
	
	console.log("userID ", userID, " connected");
	
	connections[userID] = {socket: ws};
	ws.send(JSON.stringify(["setup", userID]));
	ws.on('message', (message) => {
		var data = JSON.parse(message);
		if(data[0] == "response"){
			return true;
		}
		else if(data[0] == "setup"){
			if(data[1] == "light"){
				connections[userID].isLight = true;
			}
			else{
				if(connections[data[2]].isLight){
					connections[userID].target = data[2];
					ws.send(JSON.stringify(["response","binding",true]));
				}
				else{
					connections[userID].target = userID;
					ws.send(JSON.stringify(["response","binding",false]));
				}
			}
		}
		else if(data[0] == 'lighting'){
			if((typeof connections[userID].target) !== undefined){
				connections[connections[userID].target].socket.send(JSON.stringify(data));
			}
		}
	});
	ws.on('end', ()=>{
		delete connections[userID];
		console.log("userID ", userID, " disconnected");
	});
	ws.on('close', ()=>{
		delete connections[userID];
		console.log("userID ", userID, " disconnected");
	});
}));
wss.on('listening', ()=>{console.log('WSS listening on port',port)});
wss.on('error', (e)=>{console.log("WSS error:", e);});
hs.on('error', (e)=>{console.log("HS error:",e)});
app.use('/',express.static(__dirname + '/public'));
hs.listen(port);
