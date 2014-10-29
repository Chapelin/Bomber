module Bomber {

    export class MovingObject extends Phaser.Sprite {

        speed: number;
        name: string;
        currentMovement: MovementType;

        constructor(game: Phaser.Game, name: string, x: number, y: number, key?: any, frame?: any) {
            super(game, x, y, key, frame);
            this.game.add.existing(this);
            this.speed = 2;
            this.name = name;
            this.currentMovement = null;
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