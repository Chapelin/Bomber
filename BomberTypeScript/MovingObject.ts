module Bomber {

    export class MovingObject extends Phaser.Sprite {

        velocityOfObject: number;
        name: string;
        currentMovement: MovementType;
        isMoving: boolean
        

        constructor(game: Phaser.Game, name: string, x: number, y: number, key?: any, frame?: any) {
            super(game, x, y, key, frame);
            this.game.add.existing(this);
            this.velocityOfObject = 120;
            this.name = name;
            this.currentMovement = null;
            this.isMoving = false;
            this.animations.add("walkTop", Phaser.Animation.generateFrameNames("walk_top", 1, 3, ".png"), 10, true);
            this.animations.add("walkBot", Phaser.Animation.generateFrameNames("walk_bot", 1, 3, ".png"), 10, true);
            this.animations.add("walkLeft", Phaser.Animation.generateFrameNames("walk_left", 1, 3, ".png"), 10, true);
            this.animations.add("walkRight", Phaser.Animation.generateFrameNames("walk_right", 1, 3, ".png"), 10, true);
        }

        get speedPerFrame() : number {
            return this.velocityOfObject / 60; // fps
        }

        moveDown() {
            this.isMoving = true;
            this.body.velocity = new Phaser.Point(0, this.velocityOfObject);
            this.setAnim(MovementType.Down);
        }

        moveUp() {
            this.isMoving = true;
            this.body.velocity = new Phaser.Point(0, -this.velocityOfObject);
            this.setAnim(MovementType.Up);
        }

        moveLeft() {
            this.isMoving = true;
            this.body.velocity = new Phaser.Point(-this.velocityOfObject,0 );
            this.setAnim(MovementType.Left);
        }

        moveRight() {
            this.isMoving = true;
            this.body.velocity = new Phaser.Point(this.velocityOfObject, 0);
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
            this.body.velocity.set(0);
            if (this.animations != null) {
                this.animations.currentAnim.stop();
                this.animations.currentAnim.frame = 2;
                this.currentMovement = null;
            }
        }
    }
} 