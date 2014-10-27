module Bomber {
    export class Player extends Phaser.Sprite {


        sock: io.Socket;
        name: string;

        constructor(game: Phaser.Game, name: string, x: number, y: number, sock: io.Socket, key?: any, frame?: any) {

            super(game, x, y, key, frame);
            this.sock = sock;
            this.name = name;
            this.game.add.existing(this);
            this.animations.add("walkTop", Phaser.Animation.generateFrameNames("walk_top", 1, 3, ".png"), 10, true);
            this.sock.emit("created", this.name);
            this.animations.play("walkTop");

        }

        update() {

        }

        moveDown() {
            this.y = this.y + 2;
        }

        moveUp() {
            this.y = this.y - 2;
        }

        moveLeft() {
            this.x = this.x - 2;
        }

        moveRight() {
            this.x = this.x + 2;
        }

        stop() { //dummy for now
        }
    }
}