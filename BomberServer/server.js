var http = require('http');
var io = require("socket.io");
var port = process.env.port || 1337;
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);

var manager = io.listen(3000);
manager.on("connection", handlesocket);
var socketDico = {};

function handlesocket(socket) {
    console.log("Connected");
    var name = "";
    var cpt = new CounterTillSync(socket, 60, syncPosition);
    socket.on("created", handleCreation);
    socket.on("move", handleMove);
    socket.on("stoppedMovement", handleStop);
    socket.on("collided", handleCollided);

    function handleCollided(data) {
        console.log("Collided", name);
        socketDico[name].data.x = data.finishingX;
        socketDico[name].data.y = data.finishingY;
        data.name = name;
        socket.broadcast.emit("OpponentCollided", data);
        cpt.addCpt();
    }

    function syncPosition() {
        console.log("Sync of " + name);
        socket.broadcast.emit("syncPosition", new MovementData(null, { x: socketDico[name].data.x, y: socketDico[name].data.y }, name));
    }

    function handleStop(data) {
        console.log("Stopped : " + name);

        //TODO : check positions ?
        socketDico[name].data.x = data.x;
        socketDico[name].data.y = data.y;
        data.name = name;
        socket.broadcast.emit("stoppedMovement", data);
        cpt.addCpt();
    }

    function handleMove(data) {
        console.log("Move : " + name);
        console.log(data.typeMov + " " + data.finishingX + " " + data.finishingY);

        //the name handling is server side to avoid cheat
        data.name = name;
        socketDico[name].data.x = data.finishingX;
        socketDico[name].data.y = data.finishingY;
        socket.broadcast.emit("userMoved", data);
        cpt.addCpt();
    }

    function handleCreation(data) {
        console.log("Data reçues en creation : " + data);
        name = data;
        socketDico[name] = new InfoPlayer();
        socketDico[name].socket = socket;

        socketDico[name].data = new UserJoinedData(data, { x: 70, y: 70 });
        socket.emit("syncPosition", new MovementData(4 /* Teleportation */, { x: 70, y: 70 }, data));
        socket.broadcast.emit("userJoined", socketDico[name].data);

        for (var opponentName in socketDico) {
            if (opponentName != name)
                socket.emit("userJoined", socketDico[opponentName].data);
        }
    }
}

var CounterTillSync = (function () {
    function CounterTillSync(sock, cptToSync, tocall) {
        this.cpt = 0;
        this.toSync = cptToSync;
        this.socket = sock;
        this.callBack = tocall;
    }
    CounterTillSync.prototype.addCpt = function () {
        this.cpt++;
        if (this.cpt > this.toSync) {
            this.callBack();
            this.cpt = 0;
        }
    };
    return CounterTillSync;
})();

var InfoPlayer = (function () {
    function InfoPlayer() {
    }
    return InfoPlayer;
})();

var UserJoinedData = (function () {
    function UserJoinedData(n, pos, skin) {
        if (typeof skin === "undefined") { skin = "bomberman"; }
        this.name = n;
        this.x = pos.x;
        this.y = pos.y;
        this.skinName = skin;
    }
    return UserJoinedData;
})();

var MovementData = (function () {
    function MovementData(typ, pos, name) {
        this.finishingX = pos.x;
        this.finishingY = pos.y;
        this.typeMov = typ;
        this.name = name;
    }
    return MovementData;
})();

var MovementType;
(function (MovementType) {
    MovementType[MovementType["Down"] = 0] = "Down";
    MovementType[MovementType["Up"] = 1] = "Up";
    MovementType[MovementType["Left"] = 2] = "Left";
    MovementType[MovementType["Right"] = 3] = "Right";
    MovementType[MovementType["Teleportation"] = 4] = "Teleportation";
    MovementType[MovementType["Collided"] = 5] = "Collided";
})(MovementType || (MovementType = {}));

var StopData = (function () {
    function StopData(position) {
        this.x = position.x;
        this.y = position.y;
    }
    return StopData;
})();
//# sourceMappingURL=server.js.map
