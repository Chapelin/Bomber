var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Bomber;
(function (Bomber) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.apply(this, arguments);
        }
        Boot.prototype.create = function () {
            this.game.load.spritesheet("bomberman", "assets/bomberman.png", 16, 32, 12, 1, 1);
            this.game.load.spritesheet("decors", "assets/sol.png", 16, 16);
            this.game.load.tilemap("map", "assets/map.Csv", null, Phaser.Tilemap.CSV);
        };

        Boot.prototype.preload = function () {
            this.game.state.start("Level");
        };
        return Boot;
    })(Phaser.State);
    Bomber.Boot = Boot;
})(Bomber || (Bomber = {}));
