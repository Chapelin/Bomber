

module Bomber {
    export class Game extends Phaser.Game {
        sock: io.Socket;

        constructor() {

            super(800, 600, Phaser.AUTO, 'content', null);
            this.sock = io.connect("localhost:3000");
            this.state.add('Boot', Boot, false);
            //this.state.add('Preloader', Preloader, false);
            this.state.add('Level', Level, false);
            //this.state.add('End', End, false);
            this.state.start('Boot');

        }

    }

} 