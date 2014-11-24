var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
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
exports.BaseSocketWrapper = BaseSocketWrapper;

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
exports.ServeurSocketWrapper = ServeurSocketWrapper;
//# sourceMappingURL=Communication.js.map
