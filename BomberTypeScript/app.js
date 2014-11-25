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
    var BaseSocketWrapper = (function () {
        function BaseSocketWrapper(socket) {
            this.socket = socket;
        }
        BaseSocketWrapper.prototype.on = function (eventName, callBack) {
            this.socket.on(eventName, callBack);
        };

        BaseSocketWrapper.prototype.emit = function (evenement, data) {
            this.socket.emit(evenement, data);
        };

        BaseSocketWrapper.prototype.setTimeStampSended = function (data) {
            data.timeStampSended = new Date().getTime();
        };
        BaseSocketWrapper.prototype.setTimeStampServerReceived = function (data) {
            data.timeStampServerReceived = new Date().getTime();
        };
        BaseSocketWrapper.prototype.setTimeStampServerBroadcasted = function (data) {
            data.timeStampServerBroadcasted = new Date().getTime();
        };
        return BaseSocketWrapper;
    })();
    Bomber.BaseSocketWrapper = BaseSocketWrapper;

    var ClientSocketWrapper = (function (_super) {
        __extends(ClientSocketWrapper, _super);
        function ClientSocketWrapper(sock) {
            _super.call(this, sock);
        }
        ClientSocketWrapper.prototype.on = function (eventName, callBack) {
            //TODO : potential interceptor for localTimestamp data
            var newCallback = function (data) {
                return callBack(data);
            };
            _super.prototype.on.call(this, eventName, newCallback);
        };

        ClientSocketWrapper.prototype.emit = function (evenement, data) {
            _super.prototype.setTimeStampSended.call(this, data);
            _super.prototype.emit.call(this, evenement, data);
        };
        return ClientSocketWrapper;
    })(BaseSocketWrapper);
    Bomber.ClientSocketWrapper = ClientSocketWrapper;
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
            var sock = io.connect("localhost:3000");
            this.sockWrapper = new Bomber.ClientSocketWrapper(sock);
            this.game.stage.disableVisibilityChange = true;
        };

        Level.prototype.create = function () {
            this.prepareMap();

            this.joueur = new Bomber.Player(this.game, "toto" + Date.now(), 15, 15, this.sockWrapper, "bomberman", 1);
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.preparePhysics();
            this.sockWrapper.on("userMoved", this.handleUserMoved.bind(this));
            this.sockWrapper.on("userJoined", this.handleUserJoined.bind(this));
            this.sockWrapper.on("userQuit", this.handleUserQuit.bind(this));
            this.sockWrapper.on("syncPosition", this.handleObjectSyncPosition.bind(this));
            this.sockWrapper.on("stoppedMovement", this.handleStoppedMovement.bind(this));
            this.sockWrapper.on("OpponentCollided", this.handleCollided.bind(this));
        };

        Level.prototype.preparePhysics = function () {
            this.map.setCollision(1);
            this.game.physics.enable(this.joueur, Phaser.Physics.ARCADE);
            this.joueur.body.setSize(this.joueur.width, this.joueur.height);
            this.layer.debug = true;
        };

        Level.prototype.prepareMap = function () {
            this.map = this.game.add.tilemap("map", 16, 16);
            this.map.addTilesetImage('decors');
            this.layer = this.map.createLayer(0);
            this.layer.resizeWorld();
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
                            this.sendMove(1 /* Up */);
                        } else {
                            if (this.joueur.isMoving) {
                                this.joueur.stop();
                            }
                        }
                    }
                }
            }
            this.game.physics.arcade.collide(this.joueur, this.layer, this.callBackCollide.bind(this));
        };

        Level.prototype.handleCollided = function (data) {
            console.log(" collided");
            console.log(Bomber.MovementData.ToString(data));
            this.others[data.name].position = new Phaser.Point(data.finishingX, data.finishingY);
        };

        Level.prototype.callBackCollide = function () {
            this.game.physics.arcade.collide(this.joueur, this.layer);
            console.log("collided");
            this.sendCollided(this.joueur.position);
            return true;
        };

        Level.prototype.sendMove = function (type) {
            this.sockWrapper.emit("move", new Bomber.MovementData(type, this.joueur, this.joueur.name));
        };

        Level.prototype.handleUserMoved = function (data) {
            console.log(Bomber.MovementData.ToString(data));
            this.others[data.name].handleMovement(data);
        };

        Level.prototype.handleUserJoined = function (data) {
            console.log(Bomber.UserJoinedData.ToString(data));
            this.others[data.name] = new Bomber.Opponent(this.game, data.name, data.x, data.y, data.skinName, 1);
        };
        Level.prototype.handleUserQuit = function (data) {
            console.log(data + " quitted");
            this.others[data] = null;
        };
        Level.prototype.handleStoppedMovement = function (data) {
            console.log(Bomber.StopData.ToString(data));
            this.others[data.name].stop();
        };

        Level.prototype.handleObjectSyncPosition = function (content) {
            console.log("sync position");
            console.log(Bomber.MovementData.ToString(content));
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
                    if (synced.currentMovement != content.typeMov)
                        synced.setAnim(content.typeMov);
                }
            }
        };

        Level.prototype.sendCollided = function (position) {
            this.sockWrapper.emit("collided", new Bomber.MovementData(5 /* Collided */, position, this.joueur.name));
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
            this.velocityOfObject = 120;
            this.name = name;
            this.currentMovement = null;
            this.isMoving = false;
            this.animations.add("walkTop", Phaser.Animation.generateFrameNames("walk_top", 1, 3, ".png"), 10, true);
            this.animations.add("walkBot", Phaser.Animation.generateFrameNames("walk_bot", 1, 3, ".png"), 10, true);
            this.animations.add("walkLeft", Phaser.Animation.generateFrameNames("walk_left", 1, 3, ".png"), 10, true);
            this.animations.add("walkRight", Phaser.Animation.generateFrameNames("walk_right", 1, 3, ".png"), 10, true);
        }
        Object.defineProperty(MovingObject.prototype, "speedPerFrame", {
            get: function () {
                return this.velocityOfObject / 60;
            },
            enumerable: true,
            configurable: true
        });

        MovingObject.prototype.moveDown = function () {
            this.isMoving = true;
            this.body.velocity = new Phaser.Point(0, this.velocityOfObject);
            this.setAnim(0 /* Down */);
        };

        MovingObject.prototype.moveUp = function () {
            this.isMoving = true;
            this.body.velocity = new Phaser.Point(0, -this.velocityOfObject);
            this.setAnim(1 /* Up */);
        };

        MovingObject.prototype.moveLeft = function () {
            this.isMoving = true;
            this.body.velocity = new Phaser.Point(-this.velocityOfObject, 0);
            this.setAnim(2 /* Left */);
        };

        MovingObject.prototype.moveRight = function () {
            this.isMoving = true;
            this.body.velocity = new Phaser.Point(this.velocityOfObject, 0);
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
            this.isMoving = false;
            this.body.velocity.set(0);
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
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
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
            //commented out until usefull
            //if (this.x != content.finishingX || this.y != content.finishingY) {
            //    console.log("Error movement for " + this.name + " waited : " + content.finishingX + "," + content.finishingY + " | current : " + this.x + ", " + this.y);
            //}
        };

        Opponent.prototype.moveDown = function () {
            console.log("Opponent movedown : ");
            _super.prototype.moveDown.call(this);
        };

        Opponent.prototype.moveUp = function () {
            console.log("Opponent moveup : ");
            _super.prototype.moveUp.call(this);
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

            this.sock.emit("created", new Bomber.CreatedData(this.name));
        }
        Player.prototype.update = function () {
        };

        Player.prototype.stop = function () {
            _super.prototype.stop.call(this);
            this.sock.emit("stoppedMovement", new Bomber.StopData({ x: this.x, y: this.y }));
        };
        return Player;
    })(Bomber.MovingObject);
    Bomber.Player = Player;
})(Bomber || (Bomber = {}));
var Bomber;
(function (Bomber) {
    var CarriageReturn = "\r\n";

    var BaseData = (function () {
        function BaseData() {
            this.timeStampCreated = new Date().getTime();
        }
        BaseData.ToString = function (data) {
            var contenu = "";
            if (data.timeStampCreated)
                contenu += "Created : " + data.timeStampCreated + CarriageReturn;
            if (data.timeStampSended)
                contenu += "Sended : " + data.timeStampSended + CarriageReturn;
            ;
            if (data.timeStampServerReceived)
                contenu += "Received by server : " + data.timeStampServerReceived + CarriageReturn;
            ;
            if (data.timeStampServerBroadcasted)
                contenu += "Broadcasted by server : " + data.timeStampServerBroadcasted + CarriageReturn;
            return contenu;
        };
        return BaseData;
    })();
    Bomber.BaseData = BaseData;

    var UserJoinedData = (function (_super) {
        __extends(UserJoinedData, _super);
        function UserJoinedData(n, pos, skin) {
            if (typeof skin === "undefined") { skin = "bomberman"; }
            _super.call(this);
            this.name = n;
            this.x = pos.x;
            this.y = pos.y;
            this.skinName = skin;
        }
        UserJoinedData.ToString = function (data) {
            var contenu = "User Joined" + CarriageReturn;
            contenu += BaseData.ToString(data);
            contenu += "Name : " + data.name + CarriageReturn;
            contenu += "skinName : " + data.skinName + CarriageReturn;
            contenu += "x,y : " + data.x + " | " + data.y + CarriageReturn;
            return contenu;
        };
        return UserJoinedData;
    })(BaseData);
    Bomber.UserJoinedData = UserJoinedData;

    var MovementData = (function (_super) {
        __extends(MovementData, _super);
        function MovementData(typ, pos, name) {
            _super.call(this);
            this.finishingX = pos.x;
            this.finishingY = pos.y;
            this.typeMov = typ;
            this.name = name;
        }
        MovementData.ToString = function (data) {
            var contenu = "User moved" + CarriageReturn;
            contenu += BaseData.ToString(data);
            contenu += "Type movement : " + data.typeMov + CarriageReturn;
            contenu += "Name : " + data.name + CarriageReturn;
            contenu += "Position : " + data.finishingX + " | " + data.finishingY + CarriageReturn;
            return contenu;
        };
        return MovementData;
    })(BaseData);
    Bomber.MovementData = MovementData;

    var CreatedData = (function (_super) {
        __extends(CreatedData, _super);
        function CreatedData(name) {
            _super.call(this);
            this.name = name;
        }
        CreatedData.ToString = function (data) {
            var contenu = "User Created" + CarriageReturn;
            contenu += BaseData.ToString(data);
            contenu += "Name : " + name + CarriageReturn;
            return contenu;
        };
        return CreatedData;
    })(BaseData);
    Bomber.CreatedData = CreatedData;

    var StopData = (function (_super) {
        __extends(StopData, _super);
        function StopData(position) {
            _super.call(this);
            this.x = position.x;
            this.y = position.y;
        }
        StopData.ToString = function (data) {
            var contenu = "User stopped" + CarriageReturn;
            contenu += BaseData.ToString(data);
            contenu += "Name : " + name + CarriageReturn;
            contenu += "Position : " + data.x + " | " + data.y + CarriageReturn;
            return contenu;
        };
        return StopData;
    })(BaseData);
    Bomber.StopData = StopData;

    (function (MovementType) {
        MovementType[MovementType["Down"] = 0] = "Down";
        MovementType[MovementType["Up"] = 1] = "Up";
        MovementType[MovementType["Left"] = 2] = "Left";
        MovementType[MovementType["Right"] = 3] = "Right";
        MovementType[MovementType["Teleportation"] = 4] = "Teleportation";
        MovementType[MovementType["Collided"] = 5] = "Collided";
    })(Bomber.MovementType || (Bomber.MovementType = {}));
    var MovementType = Bomber.MovementType;
})(Bomber || (Bomber = {}));
//# sourceMappingURL=app.js.map
