module Bomber {
    export class Player extends MovingObject {


        sock: ClientSocketWrapper;
        public isMoving: boolean;

        constructor(game: Phaser.Game, name: string, x: number, y: number, sock: ClientSocketWrapper, key?: any, frame?: any) {

            super(game, name, x, y, key, frame);
            this.sock = sock;

            this.sock.emit("created", new CreatedData(this.name));
        }

        update() {

        }

        stop() {

            super.stop();
            this.sock.emit("stoppedMovement", new StopData({ x: this.x, y: this.y }));
        }
    }
}