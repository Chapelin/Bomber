﻿var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Bomber;
(function (Bomber) {
    var Level = (function (_super) {
        __extends(Level, _super);
        function Level() {
            _super.apply(this, arguments);
        }
        Level.prototype.preload = function () {
            this.game.load.spritesheet("bomberman", "assets/bomberman.png", 16, 32, 12, 1, 1);
            this.game.load.spritesheet("decors", "assets/sol.png", 16, 16, 2);
            this.game.load.tilemap("map", "assets/map.csv", null, Phaser.Tilemap.CSV);
        };

        Level.prototype.create = function () {
            this.map = this.game.add.tilemap("map");
            this.map.addTilesetImage('decors');
            var layer = this.map.createLayer(0);
            this.game.stage.disableVisibilityChange = true;
        };
        return Level;
    })(Phaser.State);
    Bomber.Level = Level;
})(Bomber || (Bomber = {}));
//# sourceMappingURL=Level.js.map
