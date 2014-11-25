var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var CarriageReturn = "\r\n";

var BaseData = (function () {
    function BaseData() {
        this.timeStampCreated = new Date().getTime();
    }
    BaseData.ToString = function (data) {
        var contenu = "";
        if (data.timeStampCreated)
            contenu += "Created : " + data.timeStampCreated + CarriageReturn;
        if (data.timeStampSended)
            contenu += "Sended : " + data.timeStampSended + CarriageReturn;
        ;
        if (data.timeStampServerReceived)
            contenu += "Received by server : " + data.timeStampServerReceived + CarriageReturn;
        ;
        if (data.timeStampServerBroadcasted)
            contenu += "Broadcasted by server : " + data.timeStampServerBroadcasted + CarriageReturn;
        return contenu;
    };
    return BaseData;
})();
exports.BaseData = BaseData;

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
    UserJoinedData.ToString = function (data) {
        var contenu = "User Joined" + CarriageReturn;
        contenu += BaseData.ToString(data);
        contenu += "Name : " + data.name + CarriageReturn;
        contenu += "skinName : " + data.skinName + CarriageReturn;
        contenu += "x,y : " + data.x + " | " + data.y + CarriageReturn;
        return contenu;
    };
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
    MovementData.ToString = function (data) {
        var contenu = "User moved" + CarriageReturn;
        contenu += BaseData.ToString(data);
        contenu += "Type movement : " + data.typeMov + CarriageReturn;
        contenu += "Name : " + data.name + CarriageReturn;
        contenu += "Position : " + data.finishingX + " | " + data.finishingY + CarriageReturn;
        return contenu;
    };
    return MovementData;
})(BaseData);
exports.MovementData = MovementData;

var CreatedData = (function (_super) {
    __extends(CreatedData, _super);
    function CreatedData(name) {
        _super.call(this);
        this.name = name;
    }
    CreatedData.ToString = function (data) {
        var contenu = "User Created" + CarriageReturn;
        contenu += BaseData.ToString(data);
        contenu += "Name : " + name + CarriageReturn;
        return contenu;
    };
    return CreatedData;
})(BaseData);
exports.CreatedData = CreatedData;

var StopData = (function (_super) {
    __extends(StopData, _super);
    function StopData(position) {
        _super.call(this);
        this.x = position.x;
        this.y = position.y;
    }
    StopData.ToString = function (data) {
        var contenu = "User stopped" + CarriageReturn;
        contenu += BaseData.ToString(data);
        contenu += "Name : " + name + CarriageReturn;
        contenu += "Position : " + data.x + " | " + data.y + CarriageReturn;
        return contenu;
    };
    return StopData;
})(BaseData);
exports.StopData = StopData;

var QuittedData = (function (_super) {
    __extends(QuittedData, _super);
    function QuittedData(n) {
        _super.call(this);
        this.name = n;
    }
    QuittedData.ToString = function (data) {
        var contenu = "User quitted" + CarriageReturn;
        contenu += BaseData.ToString(data);
        contenu += "Name : " + name + CarriageReturn;
        return contenu;
    };
    return QuittedData;
})(BaseData);
exports.QuittedData = QuittedData;

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
