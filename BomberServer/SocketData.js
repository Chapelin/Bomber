var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
exports.BaseData = BaseData;

var CreatedData = (function (_super) {
    __extends(CreatedData, _super);
    function CreatedData(name) {
        _super.call(this);
        this.name = name;
    }
    return CreatedData;
})(BaseData);
exports.CreatedData = CreatedData;

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
exports.UserJoinedData = UserJoinedData;

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
exports.MovementData = MovementData;

var StopData = (function (_super) {
    __extends(StopData, _super);
    function StopData(position) {
        _super.call(this);
        this.x = position.x;
        this.y = position.y;
    }
    return StopData;
})(BaseData);
exports.StopData = StopData;

(function (MovementType) {
    MovementType[MovementType["Down"] = 0] = "Down";
    MovementType[MovementType["Up"] = 1] = "Up";
    MovementType[MovementType["Left"] = 2] = "Left";
    MovementType[MovementType["Right"] = 3] = "Right";
    MovementType[MovementType["Teleportation"] = 4] = "Teleportation";
    MovementType[MovementType["Collided"] = 5] = "Collided";
})(exports.MovementType || (exports.MovementType = {}));
var MovementType = exports.MovementType;
//# sourceMappingURL=SocketData.js.map
