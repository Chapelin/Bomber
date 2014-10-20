

module Bomber {
    export class Game extends Phaser.Game {
        

        constructor() {

            super(800, 600, Phaser.AUTO, 'content', null);
            this.state.add('Boot', Boot, false);
            //this.state.add('Preloader', Preloader, false);
            this.state.add('Level', Level, false);
            //this.state.add('End', End, false);
            this.state.start('Boot');
            
            
        }

        //update(time : number) {
        //    console.log("update Game");
        //}

    }

} 