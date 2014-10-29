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

    }
} 