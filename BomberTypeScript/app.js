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
window.onload = function () {
    var game = new Bomber.Game();
    //var game = new SimpleGame();
};
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path='app.ts' />
var Bomber;
(function (Bomber) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.preload = function () {
        };

        Boot.prototype.create = function () {
            this.game.state.start("Level", false, false);
        };
        return Boot;
    })(Phaser.State);
    Bomber.Boot = Boot;
})(Bomber || (Bomber = {}));
var Bomber;
(function (Bomber) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this, 800, 600, Phaser.AUTO, 'content', null);
            this.sock = io.connect("localhost:3000");
            this.state.add('Boot', Bomber.Boot, false);

            //this.state.add('Preloader', Preloader, false);
            this.state.add('Level', Bomber.Level, false);

            //this.state.add('End', End, false);
            this.state.start('Boot');
        }
        return Game;
    })(Phaser.Game);
    Bomber.Game = Game;
})(Bomber || (Bomber = {}));
var Bomber;
(function (Bomber) {
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level() {
            _super.apply(this, arguments);
        }
        Level.prototype.preload = function () {
            this.game.load.spritesheet("bomberman", "http://localhost:3001/bomberman.png", 16, 32, 12, 1, 1);
            this.game.load.image("decors", "http://localhost:3001/sol.png");
            this.game.load.tilemap("map", "http://localhost:3001/map.csv", null, Phaser.Tilemap.CSV);
        };

        Level.prototype.create = function () {
            this.map = this.game.add.tilemap("map", 16, 16);
            this.map.addTilesetImage('decors');
            var layer = this.map.createLayer(0);

            //this.game.stage.disableVisibilityChange = true;
            layer.resizeWorld();
        };
        return Level;
    })(Phaser.State);
    Bomber.Level = Level;
})(Bomber || (Bomber = {}));
var Bomber;
(function (Bomber) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player() {
            _super.apply(this, arguments);
        }
        return Player;
    })(Phaser.Sprite);
    Bomber.Player = Player;
})(Bomber || (Bomber = {}));
//# sourceMappingURL=app.js.map
