module Bomber {

    export class BaseSocketWrapper {
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

    export class ClientSocketWrapper extends BaseSocketWrapper {


        constructor(sock: io.Socket) {
            super(sock);
        }

        public on(eventName: string, callBack: Function) {
            //TODO : potential interceptor for localTimestamp data
            var newCallback: Function = (data: BaseData) => callBack(data);
            super.on(eventName, newCallback);
        }

        public emit(evenement: string, data: BaseData) {
            super.setTimeStampSended(data);
            super.emit(evenement, data);
        }
    }

}
