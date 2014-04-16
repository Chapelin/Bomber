module Bomber {
    export class Boot extends Phaser.State {
        


        preload() {
          
            


        }

        create() {
            this.game.state.start("Level",false, false);
        }
    }
} 