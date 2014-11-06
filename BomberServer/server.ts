import http = require('http');
import io = require("socket.io");
var port = process.env.port || 1337;
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);

var manager = io.listen(3000);
manager.on("connection", handlesocket);
var socketDico: { [id: string]: InfoPlayer } = {};


function handlesocket(socket: io.Socket) {
    console.log("Connected");
    var name = "";
    socket.on("created", handleCreation);
    socket.on("move", handleMove);
    socket.on("stoppedMovement", handleStop);
    socket.on("collided", handleCollided);

    function handleCollided(data: MovementData) {
        console.log("Collided", name);
        socketDico[name].data.x = data.finishingX;
        socketDico[name].data.y = data.finishingY;
        data.name = name;
        socket.broadcast.emit("OpponentCollided", data);
    }

   
    function handleStop(data: StopData) {
        console.log("Stopped : " + name);
        //TODO : check positions ?
        socketDico[name].data.x = data.x;
        socketDico[name].data.y = data.y;
        data.name = name;
        socket.broadcast.emit("stoppedMovement", data);

    }

    function handleMove(data: MovementData) {
        console.log("Move : " + name);
        console.log(data.typeMov + " " + data.finishingX + " " + data.finishingY);
        //the name handling is server side to avoid cheat
        data.name = name;
        socketDico[name].data.x = data.finishingX;
        socketDico[name].data.y = data.finishingY;
        socket.broadcast.emit("userMoved", data);
    }

    function handleCreation(data: string) {
        console.log("Data reçues en creation : " + data);
        name = data;
        socketDico[name] = new InfoPlayer();
        socketDico[name].socket = socket;

        socketDico[name].data = new UserJoinedData(data, { x: 70, y: 70 });
        socket.emit("syncPosition", new MovementData(MovementType.Teleportation, { x: 70, y: 70 }, data));
        socket.broadcast.emit("userJoined", socketDico[name].data);
        //we notify the new player with the others
        for (var opponentName in socketDico) {
            if (opponentName != name)
                socket.emit("userJoined", socketDico[opponentName].data);
        }
    }
}

class InfoPlayer {
    socket: io.Socket;
    data: UserJoinedData;

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

    constructor(typ: MovementType, pos: IPositionableElement, name: string) {
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
    Right,
    Teleportation,
    Collided
}

class StopData {
    public name: string;
    public x: number;
    public y: number;

    constructor(position: IPositionableElement) {
        this.x = position.x;
        this.y = position.y;
    }
}

