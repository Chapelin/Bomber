module Bomber {

    export class Level extends Phaser.State {

        map: Phaser.Tilemap;
        sock: io.Socket;
        joueur: Player;
        cursors: Phaser.CursorKeys;

        preload() {
            this.game.load.crossOrigin = "Anonymous";
            this.game.load.spritesheet("bomberman", "http://localhost:3001/bomberman.png", 16, 32, 12, 1, 1);
            this.game.load.image("decors", "http://localhost:3001/sol.png");
            this.game.load.tilemap("map", "http://localhost:3001/map.csv", null, Phaser.Tilemap.CSV);
            this.sock = io.connect("localhost:3000");
        }

        create() {
            this.map = this.game.add.tilemap("map", 16, 16);
            this.map.addTilesetImage('decors');
            var layer = this.map.createLayer(0);
            //this.game.stage.disableVisibilityChange = true;
            layer.resizeWorld();
            this.joueur = new Player(this.game, "toto", 15, 15, this.sock, "bomberman", 1);
            // var cursors = this.game.input.keyboard.createCursorKeys();
            this.cursors = this.game.input.keyboard.createCursorKeys();
            this.sock.on("userMoved", this.handleUserMoved);
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
                        }
                    }
                }
            }
        }


        sendMove(type: MovementType) {
            this.sock.emit("move", new MovementData(type, this.joueur));
        }

        handleUserMoved(data: any) {
            console.log(data + " Moved");
        }
    }
} 