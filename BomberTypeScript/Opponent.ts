module Bomber {
    export class Opponent extends Phaser.Sprite{
        
        constructor(game: Phaser.Game,  x: number, y: number,  key?: any, frame?: any) {

            super(game, x, y, key, frame);
            this.name = name;
            this.game.add.existing(this);

        }


        public HandleMovement(content: MovementData) {
            this.x = content.finishingX;
            this.y = content.finishingY;
        }
    }
} 