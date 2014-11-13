var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
    var socketWrapper = new ServeurSocketWrapper(socket);
    socketWrapper.on("created", handleCreation);
    socketWrapper.on("move", handleMove);
    socketWrapper.on("stoppedMovement", handleStop);
    socketWrapper.on("collided", handleCollided);

    function handleCollided(data) {
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

    function handleStop(data) {
        console.log("Stopped : " + name);

        //TODO : check positions ?
        socketDico[name].data.x = data.x;
        socketDico[name].data.y = data.y;
        data.name = name;
        socketWrapper.broadcast("stoppedMovement", data);
        cpt.addCpt();
    }

    function handleMove(data) {
        console.log("Move : " + name);
        console.log(data.typeMov + " " + data.finishingX + " " + data.finishingY);

        //the name handling is server side to avoid cheat
        data.name = name;
        socketDico[name].data.x = data.finishingX;
        socketDico[name].data.y = data.finishingY;
        socketWrapper.broadcast("userMoved", data);
        cpt.addCpt();
    }

    function handleCreation(data) {
        console.log("Data reçues en creation : " + data.name);
        name = data.name;
        socketDico[name] = new InfoPlayer();
        socketDico[name].socketWrapper = socketWrapper;

        socketDico[name].data = new UserJoinedData(name, { x: 70, y: 70 });
        socketWrapper.emit("syncPosition", new MovementData(4 /* Teleportation */, { x: 70, y: 70 }, name));
        socketWrapper.broadcast("userJoined", socketDico[name].data);

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

var BaseData = (function () {
    function BaseData() {
        this.timeStampCreated = new Date().getTime();
    }
    BaseData.prototype.toString = function () {
        var contenu = "";
        contenu += "Created : " + this.timeStampCreated + "\r\n";
        contenu += "Sended : " + this.timeStampSended + "\r\n";
        ;
        contenu += "Received by server : " + this.timeStampServerReceived + "\r\n";
        ;
        contenu += "Broadcasted by server : " + this.timeStampServerBroadcasted;
        return contenu;
    };
    return BaseData;
})();

var InfoPlayer = (function () {
    function InfoPlayer() {
    }
    return InfoPlayer;
})();

var CreatedData = (function (_super) {
    __extends(CreatedData, _super);
    function CreatedData(name) {
        _super.call(this);
        this.name = name;
    }
    return CreatedData;
})(BaseData);

var UserJoinedData = (function (_super) {
    __extends(UserJoinedData, _super);
    function UserJoinedData(n, pos, skin) {
        if (typeof skin === "undefined") { skin = "bomberman"; }
        _super.call(this);
        this.name = n;
        this.x = pos.x;
        this.y = pos.y;
        this.skinName = skin;
    }
    return UserJoinedData;
})(BaseData);

var MovementData = (function (_super) {
    __extends(MovementData, _super);
    function MovementData(typ, pos, name) {
        _super.call(this);
        this.finishingX = pos.x;
        this.finishingY = pos.y;
        this.typeMov = typ;
        this.name = name;
    }
    return MovementData;
})(BaseData);

var StopData = (function (_super) {
    __extends(StopData, _super);
    function StopData(position) {
        _super.call(this);
        this.x = position.x;
        this.y = position.y;
    }
    return StopData;
})(BaseData);

var MovementType;
(function (MovementType) {
    MovementType[MovementType["Down"] = 0] = "Down";
    MovementType[MovementType["Up"] = 1] = "Up";
    MovementType[MovementType["Left"] = 2] = "Left";
    MovementType[MovementType["Right"] = 3] = "Right";
    MovementType[MovementType["Teleportation"] = 4] = "Teleportation";
    MovementType[MovementType["Collided"] = 5] = "Collided";
})(MovementType || (MovementType = {}));

var BaseSocketWrapper = (function () {
    function BaseSocketWrapper(socket) {
        this.socket = socket;
    }
    BaseSocketWrapper.prototype.on = function (eventName, callBack) {
        this.socket.on(eventName, callBack);
    };

    BaseSocketWrapper.prototype.emit = function (evenement, data) {
        this.socket.emit(evenement, data);
    };

    BaseSocketWrapper.prototype.setTimeStampSended = function (data) {
        data.timeStampSended = new Date().getTime();
    };
    BaseSocketWrapper.prototype.setTimeStampServerReceived = function (data) {
        data.timeStampServerReceived = new Date().getTime();
    };
    BaseSocketWrapper.prototype.setTimeStampServerBroadcasted = function (data) {
        data.timeStampServerBroadcasted = new Date().getTime();
    };
    return BaseSocketWrapper;
})();

var ServeurSocketWrapper = (function (_super) {
    __extends(ServeurSocketWrapper, _super);
    function ServeurSocketWrapper() {
        _super.apply(this, arguments);
    }
    ServeurSocketWrapper.prototype.broadcast = function (evenement, data) {
        _super.prototype.setTimeStampServerBroadcasted.call(this, data);
        this.socket.broadcast.emit(evenement, data);
    };

    //we timeStamp the recieving
    ServeurSocketWrapper.prototype.on = function (eventName, callBack) {
        var _this = this;
        var newCallback = function (data) {
            _super.prototype.setTimeStampServerReceived.call(_this, data);
            callBack(data);
        };
        _super.prototype.on.call(this, eventName, newCallback);
    };

    ServeurSocketWrapper.prototype.emit = function (evenement, data) {
        _super.prototype.setTimeStampSended.call(this, data);
        _super.prototype.emit.call(this, evenement, data);
    };
    return ServeurSocketWrapper;
})(BaseSocketWrapper);
//# sourceMappingURL=server.js.map
