import http = require('http');
import io = require("socket.io");
var port = process.env.port || 1337;
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);

io.listen(3000).on("connection", handlesocket);


function handlesocket (socket : io.Socket) {
    console.log("Connected");
    socket.on("created", handleCreation);
}

function handleCreation(data: any[]) {
    console.log("Data reçues en creation : " + data);
   
}