import http = require('http');
import io = require("socket.io");
var port = process.env.port || 1337;
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);

var manager = io.listen(3000);
manager.on("connection", handlesocket);


function handlesocket(socket: io.Socket) {
    console.log("Connected");
    var soc = socket;
    socket.on("created", handleCreation);
    socket.on("updated", handleUpdate);
    socket.on("move", handleMove);
    
    function handleUpdate(data: any[]) {
        console.log("Updated : " + data);

    }

    function handleMove(data: any[]) {
        console.log("Move : " + data);
        soc.broadcast.emit("userMoved", data);
    }

    function handleCreation(data: any[]) {
        console.log("Data reçues en creation : " + data);

    }
    
}

