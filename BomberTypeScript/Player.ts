module Bomber {
    export class Player extends MovingObject {


        sock: io.Socket;

        constructor(game: Phaser.Game, name: string, x: number, y: number, sock: io.Socket, key?: any, frame?: any) {

            super(game,name, x, y, key, frame);
            this.sock = sock;
           
            this.sock.emit("created", this.name);
        }

        update() {

        }
       
    }
}