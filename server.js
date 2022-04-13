<<<<<<< HEAD
const http = require('http');
const fs = require('fs');

const port = process.env.PORT || 3000;

http.createServer((req,res) => {
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
}).listen(port);
=======
var http = require("http");

http.createServer(function (req, res){
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(8080);
console.log(11000);
>>>>>>> parent of 34e40ec (test)
