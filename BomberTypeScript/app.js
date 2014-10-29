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
            this.game.load.image("decors", "http://localhost:3001/sol.png");
            this.game.load.tilemap("map", "http://localhost:3001/map.csv", null, Phaser.Tilemap.CSV);
            this.game.load.atlasJSONArray("bomberman", "http://localhost:3001/bomberman/bb.png", "http://localhost:3001/bomberman/bb_json.json");
            this.sock = io.connect("localhost:3000");
            this.game.stage.disableVisibilityChange = true;
        };

        Level.prototype.create = function () {
            this.map = this.game.add.tilemap("map", 16, 16);
            this.map.addTilesetImage('decors');
            var layer = this.map.createLayer(0);
            layer.resizeWorld();
            this.joueur = new Bomber.Player(this.game, "toto" + Date.now(), 15, 15, this.sock, "bomberman", 1);
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.sock.on("userMoved", this.handleUserMoved.bind(this));
            this.sock.on("userJoined", this.handleUserJoined.bind(this));
            this.sock.on("userQuit", this.handleUserQuit.bind(this));
            this.sock.on("syncPosition", this.handleObjectSyncPosition.bind(this));
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
            this.others[data.name].handleMovement(data);
        };

        Level.prototype.handleUserJoined = function (data) {
            console.log(data.name + " joined");
            this.others[data.name] = new Bomber.Opponent(this.game, data.name, data.x, data.y, data.skinName, 1);
        };
        Level.prototype.handleUserQuit = function (data) {
            console.log(data + " quitted");
            this.others[data] = null;
        };

        Level.prototype.handleObjectSyncPosition = function (content) {
            console.log(content.name + "sync position");
            var synced = null;
            if (this.joueur.name == content.name) {
                synced = this.joueur;
            } else {
                if (this.others.hasOwnProperty(content.name)) {
                    synced = this.others[content.name];
                }
            }

            if (synced != null) {
                synced.x = content.finishingX;
                synced.y = content.finishingY;
                if (content.typeMov == 4 /* Teleportation */) {
                    synced.stop();
                } else {
                    synced.setAnim(content.typeMov);
                }
            }
        };
        return Level;
    })(Phaser.State);
    Bomber.Level = Level;
})(Bomber || (Bomber = {}));
var Bomber;
(function (Bomber) {
    var MovingObject = (function (_super) {
        __extends(MovingObject, _super);
        function MovingObject(game, name, x, y, key, frame) {
            _super.call(this, game, x, y, key, frame);
            this.game.add.existing(this);
            this.speed = 2;
            this.name = name;
            this.currentMovement = null;
            this.animations.add("walkTop", Phaser.Animation.generateFrameNames("walk_top", 1, 3, ".png"), 10, true);
            this.animations.add("walkBot", Phaser.Animation.generateFrameNames("walk_bot", 1, 3, ".png"), 10, true);
            this.animations.add("walkLeft", Phaser.Animation.generateFrameNames("walk_left", 1, 3, ".png"), 10, true);
            this.animations.add("walkRight", Phaser.Animation.generateFrameNames("walk_right", 1, 3, ".png"), 10, true);
        }
        MovingObject.prototype.moveDown = function () {
            this.y = this.y + this.speed;
            this.setAnim(0 /* Down */);
        };

        MovingObject.prototype.moveUp = function () {
            this.y = this.y - this.speed;
            this.setAnim(1 /* Up */);
        };

        MovingObject.prototype.moveLeft = function () {
            this.x = this.x - this.speed;
            this.setAnim(2 /* Left */);
        };

        MovingObject.prototype.moveRight = function () {
            this.x = this.x + this.speed;
            this.setAnim(3 /* Right */);
        };

        MovingObject.prototype.setAnim = function (deplacement) {
            if (deplacement != this.currentMovement) {
                this.currentMovement = deplacement;
                var animeName = "";
                switch (deplacement) {
                    case 0 /* Down */:
                        animeName = "walkBot";
                        break;
                    case 2 /* Left */:
                        animeName = "walkLeft";
                        break;
                    case 3 /* Right */:
                        animeName = "walkRight";
                        break;
                    case 1 /* Up */:
                        animeName = "walkTop";
                        break;
                    default:
                }
                this.animations.play(animeName);
            }
        };

        MovingObject.prototype.stop = function () {
            if (this.animations != null) {
                this.animations.currentAnim.stop();
                this.animations.currentAnim.frame = 2;
                this.currentMovement = null;
            }
        };
        return MovingObject;
    })(Phaser.Sprite);
    Bomber.MovingObject = MovingObject;
})(Bomber || (Bomber = {}));
var Bomber;
(function (Bomber) {
    var Opponent = (function (_super) {
        __extends(Opponent, _super);
        function Opponent(game, name, x, y, key, frame) {
            _super.call(this, game, name, x, y, key, frame);
        }
        Opponent.prototype.handleMovement = function (content) {
            if (content.typeMov == 0 /* Down */) {
                this.moveDown();
            } else {
                if (content.typeMov == 2 /* Left */) {
                    this.moveLeft();
                } else {
                    if (content.typeMov == 3 /* Right */) {
                        this.moveRight();
                    } else {
                        if (content.typeMov == 1 /* Up */) {
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
        };
        return Opponent;
    })(Bomber.MovingObject);
    Bomber.Opponent = Opponent;
})(Bomber || (Bomber = {}));
var Bomber;
(function (Bomber) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, name, x, y, sock, key, frame) {
            _super.call(this, game, name, x, y, key, frame);
            this.sock = sock;

            this.sock.emit("created", this.name);
        }
        Player.prototype.update = function () {
        };
        return Player;
    })(Bomber.MovingObject);
    Bomber.Player = Player;
})(Bomber || (Bomber = {}));
var Bomber;
(function (Bomber) {
    var UserJoinedData = (function () {
        function UserJoinedData(n, pos, skin) {
            if (typeof skin === "undefined") { skin = "bomberman"; }
            this.name = n;
            this.x = pos.x;
            this.y = pos.y;
            this.skinName = skin;
        }
        return UserJoinedData;
    })();
    Bomber.UserJoinedData = UserJoinedData;

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
        MovementType[MovementType["Teleportation"] = 4] = "Teleportation";
    })(Bomber.MovementType || (Bomber.MovementType = {}));
    var MovementType = Bomber.MovementType;
})(Bomber || (Bomber = {}));
//# sourceMappingURL=app.js.map
