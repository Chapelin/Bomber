import http = require('http');
import io = require("socket.io");
var port = process.env.port || 1337;
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);

var manager = io.listen(3000);
manager.on("connection", handlesocket);
var socketDico = {};


function handlesocket(socket: io.Socket) {
    console.log("Connected");
    var name = "";
    socket.on("created", handleCreation);
    socket.on("updated", handleUpdate);
    socket.on("move", handleMove);
    
    function handleUpdate(data: any[]) {
        console.log("Updated : " + data);

    }

    function handleMove(data: MovementData) {
        console.log("Move : " + name);
        console.log(data.typeMov + " " + data.finishingX + " " + data.finishingY);
        //the name handling is server side to avoid cheat
        data.name = name;
        socket.broadcast.emit("userMoved", data);
    }

    function handleCreation(data: any[]) {
        console.log("Data reçues en creation : " + data);
        name = data.toString();
        socketDico[name] = socket;
        socket.broadcast.emit("userJoined", name);

    }
    
}


class MovementData {
        public typeMov: MovementType;
        public finishingX: number;
        public finishingY: number;
        public name: string;

    constructor(typ: MovementType, pos : IPositionableElement, name : string) {
        this.finishingX = pos.x;
        this.finishingY = pos.y;
        this.typeMov = typ;
        this.name = name;
    }

    }

 interface IPositionableElement {
    x: number;
    y: number;
}


 enum MovementType {
    Down = 0,
    Up,
    Left,
    Right
}

