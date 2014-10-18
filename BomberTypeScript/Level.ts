module Bomber {
    
    export class Level extends Phaser.State {
        
        map : Phaser.Tilemap;
  
        preload() {
            this.game.load.spritesheet("bomberman", "http://localhost:3001/bomberman.png", 16, 32, 12, 1, 1);
            this.game.load.image("decors", "http://localhost:3001/sol.png");
            this.game.load.tilemap("map", "http://localhost:3001/map.csv", null, Phaser.Tilemap.CSV);
        }

        create() {

            this.map = this.game.add.tilemap("map",16,16);
            this.map.addTilesetImage('decors');
            var layer = this.map.createLayer(0);
            //this.game.stage.disableVisibilityChange = true;
            layer.resizeWorld();
        }

    }
} 