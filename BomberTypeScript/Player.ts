module Bomber {
    export class Player extends Phaser.Sprite {


        sock: io.Socket;
        name: string;
        currentMovement: MovementType;

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
            this.currentMovement = null;


        }

        update() {

        }

        moveDown() {
            this.y = this.y + 2;
            this.setAnim(MovementType.Down);
        }

        moveUp() {
            this.y = this.y - 2;
            this.setAnim(MovementType.Up);
        }

        moveLeft() {
            this.x = this.x - 2;
            this.setAnim(MovementType.Left);
        }

        moveRight() {
            this.x = this.x + 2;
            this.setAnim(MovementType.Right);
        }


        private setAnim(deplacement: MovementType) {
            if (deplacement != this.currentMovement) {
                this.currentMovement = deplacement;
                var animeName = "";
                switch (deplacement) {
                    case MovementType.Down:
                        animeName = "walkBot";
                    break;
                    case MovementType.Left:
                        animeName = "walkLeft";
                    break;
                    case MovementType.Right:
                        animeName = "walkRight";
                    break;
                    case MovementType.Up:
                        animeName = "walkTop";
                    break;
                    default:
                }
                this.animations.play(animeName);
            }
        }

        stop() {
            if (this.animations != null) {
                this.animations.currentAnim.stop();
                this.animations.currentAnim.frame = 2;
                this.currentMovement = null;
            }
        }
    }
}