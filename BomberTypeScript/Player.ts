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
            this.animations.add("walkBot", Phaser.Animation.generateFrameNames("walk_bot", 1, 3, ".png"), 10, true);
            this.animations.add("walkLeft", Phaser.Animation.generateFrameNames("walk_left", 1, 3, ".png"), 10, true);
            this.animations.add("walkRight", Phaser.Animation.generateFrameNames("walk_right", 1, 3, ".png"), 10, true);
            this.sock.emit("created", this.name);
            

        }

        update() {

        }

        moveDown() {
            this.y = this.y + 2;
            this.setAnim("walkBot");
        }

        moveUp() {
            this.y = this.y - 2;
            this.setAnim("walkTop");
        }

        moveLeft() {
            this.x = this.x - 2;
            this.setAnim("walkLeft");
        }

        moveRight() {
            this.x = this.x + 2;
            this.setAnim("walkRight");
        }

        private setAnim(animation: string) {
            if (this.animations.currentAnim.name != animation) {
                this.animations.play(animation);
            }
        }

        stop() { //dummy for now
            this.animations.currentAnim.stop();
        }
    }
}