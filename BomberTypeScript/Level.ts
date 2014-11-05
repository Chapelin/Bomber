module Bomber {

    export class Level extends Phaser.State {

        map: Phaser.Tilemap;
        sock: io.Socket;
        joueur: Player;
        cursors: Phaser.CursorKeys;
        others: { [id: string]: Opponent };
        layer : Phaser.TilemapLayer;

        preload() {
            this.others = {};
            this.game.load.crossOrigin = "Anonymous";
            this.game.load.image("decors", "http://localhost:3001/sol.png");
            this.game.load.tilemap("map", "http://localhost:3001/map.csv", null, Phaser.Tilemap.CSV);
            this.game.load.atlasJSONArray("bomberman", "http://localhost:3001/bomberman/bb.png", "http://localhost:3001/bomberman/bb_json.json");
            this.sock = io.connect("localhost:3000");
            this.game.stage.disableVisibilityChange = true;
        }

        create() {
            this.prepareMap();
           
            

            this.joueur = new Player(this.game, "toto" + Date.now(), 15, 15, this.sock, "bomberman", 1);
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.preparePhysics();
            this.sock.on("userMoved", this.handleUserMoved.bind(this));
            this.sock.on("userJoined", this.handleUserJoined.bind(this));
            this.sock.on("userQuit", this.handleUserQuit.bind(this));
            this.sock.on("syncPosition", this.handleObjectSyncPosition.bind(this));
            this.sock.on("stoppedMovement", this.handleStoppedMovement.bind(this));
        }

        preparePhysics() {
            this.map.setCollision(1);
            this.game.physics.enable(this.joueur, Phaser.Physics.ARCADE);
            this.joueur.body.setSize(this.joueur.width, this.joueur.height);
            this.layer.debug = true;
        }

        prepareMap() {
            this.map = this.game.add.tilemap("map", 16, 16);
            this.map.addTilesetImage('decors');
            this.layer = this.map.createLayer(0);
            this.layer.resizeWorld();
        }

        update() {
            if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                this.game.physics.arcade.collide(this.joueur, this.layer, this.callBackCollide.bind(this));
            }
            this.joueur.body.velocity.set(0);

            if (this.cursors.down.isDown) {
                this.joueur.moveDown();
                this.sendMove(MovementType.Down);
            } else {
                if (this.cursors.left.isDown) {
                    this.joueur.moveLeft();
                    this.sendMove(MovementType.Left);
                } else {
                    if (this.cursors.right.isDown) {
                        this.joueur.moveRight();
                        this.sendMove(MovementType.Right);
                    } else {
                        if (this.cursors.up.isDown) {
                            this.joueur.moveUp();
                            this.sendMove(MovementType.Up);
                        } else {
                            if (this.joueur.isMoving) {
                                this.joueur.stop();
                            }
                        }
                    }
                }
            }
            
           
        }

        callBackCollide() : boolean {
            this.game.physics.arcade.collide(this.joueur, this.layer);
            console.log("collided");
            return true;
        }

        sendMove(type: MovementType) {
            this.sock.emit("move", new MovementData(type, this.joueur, this.joueur.name));
        }

        handleUserMoved(data: MovementData) {
            console.log(data.name + " Moved");
            this.others[data.name].handleMovement(data);
        }

        handleUserJoined(data: UserJoinedData) {
            console.log(data.name + " joined");
            this.others[data.name] = new Opponent(this.game, data.name, data.x, data.y, data.skinName, 1);
        }
        handleUserQuit(data: string) {
            console.log(data + " quitted");
            this.others[data] = null;
        }
        handleStoppedMovement(data: StopData) {
            console.log(data.name + " stopped");
            this.others[data.name].stop();
        }

        handleObjectSyncPosition(content: MovementData) {
            console.log(content.name + "sync position");
            var synced: MovingObject = null;
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
                if (content.typeMov == MovementType.Teleportation) {
                    synced.stop();
                } else {
                    synced.setAnim(content.typeMov);
                }
            }
        }
    }

} 