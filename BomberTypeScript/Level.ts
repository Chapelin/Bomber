module Bomber {

    export class Level extends Phaser.State {

        map: Phaser.Tilemap;
        sockWrapper: ClientSocketWrapper;
        joueur: Player;
        cursors: Phaser.CursorKeys;
        others: { [id: string]: Opponent };
        layer: Phaser.TilemapLayer;

        preload() {
            this.others = {};
            this.game.load.crossOrigin = "Anonymous";
            this.game.load.image("decors", "http://localhost:3001/sol.png");
            this.game.load.tilemap("map", "http://localhost:3001/map.csv", null, Phaser.Tilemap.CSV);
            this.game.load.atlasJSONArray("bomberman", "http://localhost:3001/bomberman/bb.png", "http://localhost:3001/bomberman/bb_json.json");
            var sock = io.connect("localhost:3000");
            this.sockWrapper = new ClientSocketWrapper(sock);
            this.game.stage.disableVisibilityChange = true;
        }

        create() {
            this.prepareMap();



            this.joueur = new Player(this.game, "toto" + Date.now(), 15, 15, this.sockWrapper, "bomberman", 1);
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.preparePhysics();
            this.sockWrapper.on("userMoved", this.handleUserMoved.bind(this));
            this.sockWrapper.on("userJoined", this.handleUserJoined.bind(this));
            this.sockWrapper.on("userQuit", this.handleUserQuit.bind(this));
            this.sockWrapper.on("syncPosition", this.handleObjectSyncPosition.bind(this));
            this.sockWrapper.on("stoppedMovement", this.handleStoppedMovement.bind(this));
            this.sockWrapper.on("OpponentCollided", this.handleCollided.bind(this));
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
            this.game.physics.arcade.collide(this.joueur, this.layer, this.callBackCollide.bind(this));

        }

        handleCollided(data: MovementData) {
            console.log(" collided");
            console.log(MovementData.ToString(data));
            this.others[data.name].position = new Phaser.Point(data.finishingX, data.finishingY);
        }

        callBackCollide(): boolean {
            this.game.physics.arcade.collide(this.joueur, this.layer);
            console.log("collided");
            this.sendCollided(this.joueur.position);
            return true;
        }

        sendMove(type: MovementType) {
            this.sockWrapper.emit("move", new MovementData(type, this.joueur, this.joueur.name));
        }

        handleUserMoved(data: MovementData) {
            console.log(MovementData.ToString(data));
            this.others[data.name].handleMovement(data);
        }

        handleUserJoined(data: UserJoinedData) {
            console.log(UserJoinedData.ToString(data));
            this.others[data.name] = new Opponent(this.game, data.name, data.x, data.y, data.skinName, 1);
        }
        handleUserQuit(data: QuittedData) {
            console.log(QuittedData.ToString(data));
            //TODO : better deletion handling
            this.others[data.name].kill();
            this.others[data.name] = null;
        }
        handleStoppedMovement(data: StopData) {
            console.log(StopData.ToString(data));
            this.others[data.name].stop();
        }

        handleObjectSyncPosition(content: MovementData) {
            console.log("sync position");
            console.log(MovementData.ToString(content));
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
                    if(synced.currentMovement != content.typeMov)
                        synced.setAnim(content.typeMov);
                }
            }
        }

        sendCollided(position) {
            this.sockWrapper.emit("collided", new MovementData(MovementType.Collided, position, this.joueur.name));
        }
    }

} 