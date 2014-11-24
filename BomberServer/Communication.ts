import io = require("socket.io");
import SocketData = require("./SocketData")

export class BaseSocketWrapper {
    public socket: io.Socket;

    constructor(socket: io.Socket) {
        this.socket = socket;
    }

    public on(eventName: string, callBack: Function) {

        this.socket.on(eventName, callBack);
    }

    public emit(evenement: string, data: SocketData.BaseData) {
        this.socket.emit(evenement, data);
    }

    public setTimeStampSended(data: SocketData.BaseData) {
        data.timeStampSended = new Date().getTime();
    }
    public setTimeStampServerReceived(data: SocketData.BaseData) {
        data.timeStampServerReceived = new Date().getTime();
    }
    public setTimeStampServerBroadcasted(data: SocketData.BaseData) {
        data.timeStampServerBroadcasted = new Date().getTime();
    }
}


export class ServeurSocketWrapper extends BaseSocketWrapper {

    public broadcast(evenement: string, data: SocketData.BaseData) {
        super.setTimeStampServerBroadcasted(data);
        this.socket.broadcast.emit(evenement, data);
    }

    //we timeStamp the recieving
    public on(eventName: string, callBack: Function) {
        var newCallback: Function = (data: SocketData.BaseData) => {
            super.setTimeStampServerReceived(data);
            callBack(data);
        };
        super.on(eventName, newCallback);
    }

    public emit(evenement: string, data: SocketData.BaseData) {
        super.setTimeStampSended(data);
        super.emit(evenement, data);
    }
}