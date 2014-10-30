module Bomber {

    export class MovingObject extends Phaser.Sprite {

        speed: number;
        name: string;
        currentMovement: MovementType;
        isMoving : boolean

        constructor(game: Phaser.Game, name: string, x: number, y: number, key?: any, frame?: any) {
            super(game, x, y, key, frame);
            this.game.add.existing(this);
            this.speed = 2;
            this.name = name;
            this.currentMovement = null;
            this.isMoving = false;
            this.animations.add("walkTop", Phaser.Animation.generateFrameNames("walk_top", 1, 3, ".png"), 10, true);
            this.animations.add("walkBot", Phaser.Animation.generateFrameNames("walk_bot", 1, 3, ".png"), 10, true);
            this.animations.add("walkLeft", Phaser.Animation.generateFrameNames("walk_left", 1, 3, ".png"), 10, true);
            this.animations.add("walkRight", Phaser.Animation.generateFrameNames("walk_right", 1, 3, ".png"), 10, true);
        }

        moveDown() {
            this.isMoving = true;
            this.y = this.y + this.speed;
            this.setAnim(MovementType.Down);
        }

        moveUp() {
            this.isMoving = true;
            this.y = this.y - this.speed;
            this.setAnim(MovementType.Up);
        }

        moveLeft() {
            this.isMoving = true;
            this.x = this.x - this.speed;
            this.setAnim(MovementType.Left);
        }

        moveRight() {
            this.isMoving = true;
            this.x = this.x + this.speed;
            this.setAnim(MovementType.Right);
        }

        public setAnim(deplacement: MovementType) {
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
            this.isMoving = false;
            if (this.animations != null) {
                this.animations.currentAnim.stop();
                this.animations.currentAnim.frame = 2;
                this.currentMovement = null;
            }
        }
    }
} 