//class SimpleGame {

//    socker: io.Socket;
//    toto : number;
//    constructor() {
//        this.socker = io.connect("localhost:3000");
//        this.toto = 5;
//        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create });
        
//    }

//    game: Phaser.Game;

//    preload() {
//        this.game.load.image('logo', 'phaser2.png');
//    }

//    create() {
//        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
//        logo.anchor.setTo(0.5, 0.5);
//        console.log(this.toto);
//        this.socker.emit("created", "tututututu");
       

//    }

//}

window.onload = () => {

   var game = new Bomber.Game();
    //var game = new SimpleGame();
};
