module Bomber {

    export class Level extends Phaser.State {

        map: Phaser.Tilemap;
        sock: io.Socket;
        joueur: Player;
        cursors: Phaser.CursorKeys;
        others: { [id: string]: Opponent};

        preload() {
            this.others = {};
            this.game.load.crossOrigin = "Anonymous";
            this.game.load.image("decors", "http://localhost:3001/sol.png");
            this.game.load.tilemap("map", "http://localhost:3001/map.csv", null, Phaser.Tilemap.CSV);
            this.game.load.atlasJSONArray("bomberman","http://localhost:3001/bomberman/bb.png","http://localhost:3001/bomberman/bb_json.json");
            this.sock = io.connect("localhost:3000");
            
        }

        create() {
            this.map = this.game.add.tilemap("map", 16, 16);
            this.map.addTilesetImage('decors');
            var layer = this.map.createLayer(0);
            layer.resizeWorld();
            this.joueur = new Player(this.game, "toto"+Date.now(), 15, 15, this.sock, "bomberman", 1);
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.sock.on("userMoved", this.handleUserMoved.bind(this));
            this.sock.on("userJoined", this.handleUserJoined.bind(this));
            this.sock.on("userQuit", this.handleUserQuit.bind(this));


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
                            this.sendMove(MovementType.Down);
                        } else {
                            this.joueur.stop();
                        }
                    }
                }
            }
        }

        sendMove(type: MovementType) {
            this.sock.emit("move", new MovementData(type, this.joueur, this.joueur.name));
        }

        handleUserMoved(data: MovementData) {
            console.log(data.name + " Moved");
            this.others[data.name].HandleMovement(data);
        }

        handleUserJoined(data: UserJoinedData) {
            console.log(data.name + " joined");
            this.others[data.name] = new Opponent(this.game, data.x, data.y, data.skinName, 1);
        }
        handleUserQuit(data: string) {
            console.log(data + " quitted");
            this.others[data] = null;
        }
    }

} 