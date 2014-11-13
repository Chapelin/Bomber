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
    var socketWrapper = new ServeurSocketWrapper(socket);
    socketWrapper.on("created", handleCreation);
    socketWrapper.on("move", handleMove);
    socketWrapper.on("stoppedMovement", handleStop);
    socketWrapper.on("collided", handleCollided);

    function handleCollided(data: MovementData) {
        console.log("Collided", name);
        socketDico[name].data.x = data.finishingX;
        socketDico[name].data.y = data.finishingY;
        data.name = name;
        socketWrapper.broadcast("OpponentCollided", data);
        cpt.addCpt();
    }


    function syncPosition() {
        console.log("Sync of " + name);
        socketWrapper.broadcast("syncPosition", new MovementData(null, { x: socketDico[name].data.x, y: socketDico[name].data.y }, name));
    }

    function handleStop(data: StopData) {
        console.log("Stopped : " + name);
        //TODO : check positions ?
        socketDico[name].data.x = data.x;
        socketDico[name].data.y = data.y;
        data.name = name;
        socketWrapper.broadcast("stoppedMovement", data);
        cpt.addCpt();

    }

    function handleMove(data: MovementData) {
        console.log("Move : " + name);
        console.log(data.typeMov + " " + data.finishingX + " " + data.finishingY);
        //the name handling is server side to avoid cheat
        data.name = name;
        socketDico[name].data.x = data.finishingX;
        socketDico[name].data.y = data.finishingY;
        socketWrapper.broadcast("userMoved", data);
        cpt.addCpt();
    }

    function handleCreation(data: CreatedData) {
        console.log("Data reçues en creation : " + data.name);
        name = data.name;
        socketDico[name] = new InfoPlayer();
        socketDico[name].socketWrapper = socketWrapper;

        socketDico[name].data = new UserJoinedData(name, { x: 70, y: 70 });
        socketWrapper.emit("syncPosition", new MovementData(MovementType.Teleportation, { x: 70, y: 70 }, name));
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

class BaseData {
    public timeStampCreated: number;
    public timeStampSended: number;
    public timeStampServerReceived: number;
    public timeStampServerBroadcasted: number;

    constructor() {
        this.timeStampCreated = new Date().getTime();
    }

    public toString(): string {
        var contenu = "";
        contenu += "Created : " + this.timeStampCreated + "\r\n";
        contenu += "Sended : " + this.timeStampSended + "\r\n";;
        contenu += "Received by server : " + this.timeStampServerReceived + "\r\n";;
        contenu += "Broadcasted by server : " + this.timeStampServerBroadcasted;
        return contenu;
    }
}

class InfoPlayer {
    socketWrapper: ServeurSocketWrapper;
    data: UserJoinedData;

}

class CreatedData extends BaseData {
    public name: string;

    constructor(name: string) {
        super();
        this.name = name;
    }
}



class UserJoinedData extends BaseData {
    public name: string;
    public x: number;
    public y: number;
    //Later use
    public skinName: string;

    constructor(n: string, pos: IPositionableElement, skin: string = "bomberman") {
        super();
        this.name = n;
        this.x = pos.x;
        this.y = pos.y;
        this.skinName = skin;
    }
}

class MovementData extends BaseData {
    public typeMov: MovementType;
    public finishingX: number;
    public finishingY: number;
    public name: string;

    constructor(typ: MovementType, pos: IPositionableElement, name: string) {
        super();
        this.finishingX = pos.x;
        this.finishingY = pos.y;
        this.typeMov = typ;
        this.name = name;
    }

}

class StopData extends BaseData {
    public name: string;
    public x: number;
    public y: number;

    constructor(position: IPositionableElement) {
        super();
        this.x = position.x;
        this.y = position.y;
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

class BaseSocketWrapper {
    public socket: io.Socket;

    constructor(socket: io.Socket) {
        this.socket = socket;
    }

    public on(eventName: string, callBack: Function) {

        this.socket.on(eventName, callBack);
    }

    public emit(evenement: string, data: BaseData) {
        this.socket.emit(evenement, data);
    }

    public setTimeStampSended(data: BaseData) {
        data.timeStampSended = new Date().getTime();
    }
    public setTimeStampServerReceived(data: BaseData) {
        data.timeStampServerReceived = new Date().getTime();
    }
    public setTimeStampServerBroadcasted(data: BaseData) {
        data.timeStampServerBroadcasted = new Date().getTime();
    }
}


class ServeurSocketWrapper extends BaseSocketWrapper {

    public broadcast(evenement: string, data: BaseData) {
        super.setTimeStampServerBroadcasted(data);
        this.socket.broadcast.emit(evenement, data);
    }

    //we timeStamp the recieving
    public on(eventName: string, callBack: Function) {
        var newCallback: Function = (data: BaseData) => {
            super.setTimeStampServerReceived(data);
            callBack(data);
        };
        super.on(eventName, newCallback);
    }

    public emit(evenement: string, data: BaseData) {
        super.setTimeStampSended(data);
        super.emit(evenement, data);
    }
}