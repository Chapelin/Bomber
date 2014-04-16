var __extends = this.__extends || function (d, b) {
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
            this.map = this.game.add.tilemap("map");
            this.map.addTilesetImage('decors');
        };
        return Level;
    })(Phaser.State);
    Bomber.Level = Level;
})(Bomber || (Bomber = {}));
