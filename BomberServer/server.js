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
    socket.on("created", handleCreation);
    socket.on("updated", handleUpdate);
    socket.on("move", handleMove);

    function handleUpdate(data) {
        console.log("Updated : " + data);
    }

    function handleMove(data) {
        console.log("Move : " + name);
        console.log(data.typeMov + " " + data.finishingX + " " + data.finishingY);

        //the name handling is server side to avoid cheat
        data.name = name;
        socket.broadcast.emit("userMoved", data);
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
})(MovementType || (MovementType = {}));
//# sourceMappingURL=server.js.map
