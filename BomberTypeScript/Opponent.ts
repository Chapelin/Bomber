module Bomber {
    export class Opponent extends MovingObject {
        
        constructor(game: Phaser.Game,name : string,  x: number, y: number,  key?: any, frame?: any) {
            super(game, name, x, y, key, frame);
            
        }


        public handleMovement(content: MovementData) {

            if (content.typeMov == MovementType.Down) {
                this.moveDown();
            } else {
                if (content.typeMov == MovementType.Left) {
                    this.moveLeft();
                } else {
                if (content.typeMov == MovementType.Right) {
                        this.moveRight();
                    } else {
                    if (content.typeMov ==  MovementType.Up) {
                            this.moveUp();
                        } else {
                            this.stop();
                        }
                    }
                }
            }

            if (this.x != content.finishingX || this.y != content.finishingY) {
                console.log("Error movement for " + this.name + " waited : " + content.finishingX + "," + content.finishingY + " | current : " + this.x + ", " + this.y);
            }
        }

        public moveDown() {
            console.log("Opponent movedown : ");
            super.moveDown();
        }

        public moveUp() {
            console.log("Opponent moveup : ");
            super.moveUp();
        }
    }

} 