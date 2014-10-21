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
            this.others = {};
            this.game.load.crossOrigin = "Anonymous";
            this.game.load.spritesheet("bomberman", "http://localhost:3001/bomberman.png", 16, 32, 12, 1, 1);
            this.game.load.image("decors", "http://localhost:3001/sol.png");
            this.game.load.tilemap("map", "http://localhost:3001/map.csv", null, Phaser.Tilemap.CSV);
            this.sock = io.connect("localhost:3000");
        };

        Level.prototype.create = function () {
            this.map = this.game.add.tilemap("map", 16, 16);
            this.map.addTilesetImage('decors');
            var layer = this.map.createLayer(0);

            //this.game.stage.disableVisibilityChange = true;
            layer.resizeWorld();
            this.joueur = new Bomber.Player(this.game, "toto", 15, 15, this.sock, "bomberman", 1);

            // var cursors = this.game.input.keyboard.createCursorKeys();
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.sock.on("userMoved", this.handleUserMoved);
            this.sock.on("userJoined", this.handleUserJoined);
            this.sock.on("userQuit", this.handleUserQuit);
        };

        Level.prototype.update = function () {
            if (this.cursors.down.isDown) {
                this.joueur.moveDown();
                this.sendMove(0 /* Down */);
            } else {
                if (this.cursors.left.isDown) {
                    this.joueur.moveLeft();
                    this.sendMove(2 /* Left */);
                } else {
                    if (this.cursors.right.isDown) {
                        this.joueur.moveRight();
                        this.sendMove(3 /* Right */);
                    } else {
                        if (this.cursors.up.isDown) {
                            this.joueur.moveUp();
                            this.sendMove(0 /* Down */);
                        } else {
                            this.joueur.stop();
                        }
                    }
                }
            }
        };

        Level.prototype.sendMove = function (type) {
            this.sock.emit("move", new Bomber.MovementData(type, this.joueur, this.joueur.name));
        };

        Level.prototype.handleUserMoved = function (data) {
            console.log(data.name + " Moved");
        };

        Level.prototype.handleUserJoined = function (data, toto) {
            console.log(data + " joined");

            toto.others[data] = new Bomber.Opponent();
        };
        Level.prototype.handleUserQuit = function (data) {
            console.log(data + " quitted");
            this.others[data] = null;
        };
        return Level;
    })(Phaser.State);
    Bomber.Level = Level;
})(Bomber || (Bomber = {}));
var Bomber;
(function (Bomber) {
    var Opponent = (function () {
        function Opponent() {
        }
        return Opponent;
    })();
    Bomber.Opponent = Opponent;
})(Bomber || (Bomber = {}));
var Bomber;
(function (Bomber) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, name, x, y, sock, key, frame) {
            _super.call(this, game, x, y, key, frame);
            this.sock = sock;
            this.name = name;
            this.game.add.existing(this);
            this.sock.emit("created", this.name);
        }
        Player.prototype.update = function () {
        };

        Player.prototype.moveDown = function () {
            this.y = this.y + 2;
        };

        Player.prototype.moveUp = function () {
            this.y = this.y - 2;
        };

        Player.prototype.moveLeft = function () {
            this.x = this.x - 2;
        };

        Player.prototype.moveRight = function () {
            this.x = this.x + 2;
        };

        Player.prototype.stop = function () {
        };
        return Player;
    })(Phaser.Sprite);
    Bomber.Player = Player;
})(Bomber || (Bomber = {}));
var Bomber;
(function (Bomber) {
    var MovementData = (function () {
        function MovementData(typ, pos, name) {
            this.finishingX = pos.x;
            this.finishingY = pos.y;
            this.typeMov = typ;
            this.name = name;
        }
        return MovementData;
    })();
    Bomber.MovementData = MovementData;

    (function (MovementType) {
        MovementType[MovementType["Down"] = 0] = "Down";
        MovementType[MovementType["Up"] = 1] = "Up";
        MovementType[MovementType["Left"] = 2] = "Left";
        MovementType[MovementType["Right"] = 3] = "Right";
    })(Bomber.MovementType || (Bomber.MovementType = {}));
    var MovementType = Bomber.MovementType;
})(Bomber || (Bomber = {}));
//# sourceMappingURL=app.js.map
