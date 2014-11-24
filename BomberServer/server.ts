import Communication = require("./Communication");
import SocketData = require("./SocketData")
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
    var cpt = new CounterTillSync(socket, 60, syncPosition);
    var socketWrapper = new Communication.ServeurSocketWrapper(socket);
    socketWrapper.on("created", handleCreation);
    socketWrapper.on("move", handleMove);
    socketWrapper.on("stoppedMovement", handleStop);
    socketWrapper.on("collided", handleCollided);

    function handleCollided(data: SocketData.MovementData) {
        console.log("Collided", name);
        socketDico[name].data.x = data.finishingX;
        socketDico[name].data.y = data.finishingY;
        data.name = name;
        socketWrapper.broadcast("OpponentCollided", data);
        cpt.addCpt();
    }


    function syncPosition() {
        console.log("Sync of " + name);
        socketWrapper.broadcast("syncPosition", new SocketData.MovementData(null, { x: socketDico[name].data.x, y: socketDico[name].data.y }, name));
    }

    function handleStop(data: SocketData.StopData) {
        console.log("Stopped : " + name);
        //TODO : check positions ?
        socketDico[name].data.x = data.x;
        socketDico[name].data.y = data.y;
        data.name = name;
        socketWrapper.broadcast("stoppedMovement", data);
        cpt.addCpt();

    }

    function handleMove(data: SocketData.MovementData) {
        console.log("Move : " + name);
        console.log(data.typeMov + " " + data.finishingX + " " + data.finishingY);
        //the name handling is server side to avoid cheat
        data.name = name;
        socketDico[name].data.x = data.finishingX;
        socketDico[name].data.y = data.finishingY;
        socketWrapper.broadcast("userMoved", data);
        cpt.addCpt();
    }

    function handleCreation(data: SocketData.CreatedData) {
        console.log("Data reçues en creation : " + data.name);
        name = data.name;
        socketDico[name] = new InfoPlayer();
        socketDico[name].socketWrapper = socketWrapper;

        socketDico[name].data = new SocketData.UserJoinedData(name, { x: 70, y: 70 });
        socketWrapper.emit("syncPosition", new SocketData.MovementData(SocketData.MovementType.Teleportation, { x: 70, y: 70 }, name));
        socketWrapper.broadcast("userJoined", socketDico[name].data);
        //we notify the new player with the others
        for (var opponentName in socketDico) {
            if (opponentName != name)
                socket.emit("userJoined", socketDico[opponentName].data);
        }
    }
}

class CounterTillSync {
    cpt: number;
    socket: io.Socket;
    toSync: number;
    callBack: Function;

    constructor(sock: io.Socket, cptToSync: number, tocall: Function) {
        this.cpt = 0;
        this.toSync = cptToSync;
        this.socket = sock;
        this.callBack = tocall;
    }

    addCpt() {
        this.cpt++;
        if (this.cpt > this.toSync) {
            this.callBack();
            this.cpt = 0;
        }

    }

}


class InfoPlayer {
    socketWrapper: Communication.ServeurSocketWrapper;
    data: SocketData.UserJoinedData;

}


