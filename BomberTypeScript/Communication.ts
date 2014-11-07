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
            data.setTimeStampSended();
            super.emit(evenement, data);
        }
    }

    export class ServeurSocketWrapper extends BaseSocketWrapper {
        
        //we timeStamp the recieving
        public on(eventName: string, callBack: Function) {
            var newCallback: Function = (data: BaseData) => {
                data.setTimeStampServerReceived();
                callBack(data);
            };
            super.on(eventName, newCallback);
        }
    }
} 