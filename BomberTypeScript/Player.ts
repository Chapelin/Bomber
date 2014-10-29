module Bomber {
    export class Player extends MovingObject {


        sock: io.Socket;

        constructor(game: Phaser.Game, name: string, x: number, y: number, sock: io.Socket, key?: any, frame?: any) {

            super(game,name, x, y, key, frame);
            this.sock = sock;
            this.animations.add("walkTop", Phaser.Animation.generateFrameNames("walk_top", 1, 3, ".png"), 10, true);
            this.animations.add("walkBot", Phaser.Animation.generateFrameNames("walk_bot", 1, 3, ".png"), 10, true);
            this.animations.add("walkLeft", Phaser.Animation.generateFrameNames("walk_left", 1, 3, ".png"), 10, true);
            this.animations.add("walkRight", Phaser.Animation.generateFrameNames("walk_right", 1, 3, ".png"), 10, true);
            this.sock.emit("created", this.name);
        }

        update() {

        }
       
    }
}