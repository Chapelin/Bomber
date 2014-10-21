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
    var soc = socket;
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
        soc.broadcast.emit("userMoved", data);
    }

    function handleCreation(data) {
        console.log("Data reçues en creation : " + data);
        name = data.toString();
        socketDico[name] = socket;
    }
}

var MovementData = (function () {
    function MovementData(typ, pos) {
        this.finishingX = pos.x;
        this.finishingY = pos.y;
        this.typeMov = typ;
    }
    return MovementData;
})();

var MovementType;
(function (MovementType) {
    MovementType[MovementType["Down"] = 0] = "Down";
    MovementType[MovementType["Up"] = 1] = "Up";
    MovementType[MovementType["Left"] = 2] = "Left";
    MovementType[MovementType["Right"] = 3] = "Right";
})(MovementType || (MovementType = {}));
//# sourceMappingURL=server.js.map
