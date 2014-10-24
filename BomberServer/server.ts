import http = require('http');
import io = require("socket.io");
var port = process.env.port || 1337;
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);

var manager = io.listen(3000);
manager.on("connection", handlesocket);
var socketDico : {[id : string ]: InfoPlayer}= {};


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

    function handleCreation(data: string) {
        console.log("Data reçues en creation : " + data);
        name = data;
        socketDico[name] = new InfoPlayer();
        socketDico[name].socket = socket;

        socketDico[name].data = new UserJoinedData(data, { x: 70, y: 70 });
        socket.broadcast.emit("userJoined", socketDico[name].data);
        //we notify the new player with the others
        for (var opponentName in socketDico) {
            if (opponentName != name)
                socket.emit("userJoined", socketDico[opponentName].data);
        }
    }
}

class InfoPlayer
{
    socket: io.Socket;
    data : UserJoinedData;
    
}


class UserJoinedData {
    public name: string;
    public x: number;
    public y: number;
    //Later use
    public skinName: string;

    constructor(n: string, pos: IPositionableElement, skin: string = "bomberman") {
        this.name = n;
        this.x = pos.x;
        this.y = pos.y;
        this.skinName = skin;
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

