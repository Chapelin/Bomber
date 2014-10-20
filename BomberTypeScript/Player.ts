 module Bomber {
     export class Player extends Phaser.Sprite {
         
         
         sock: io.Socket;
         name : string;

         constructor(game : Phaser.Game,name : string,x : number, y : number,sock : io.Socket, key? : any, frame? : any) {

             super(game, x, y, key, frame);
             this.sock = sock;
             this.name = name;
             this.game.add.existing(this);
             this.sock.emit("created", this.name);
             
         }
         
         update() {
             
         }

         moveDown() {
             this.y = this.y + 2;
         }

         moveUp() {
             this.y = this.y - 2;
         }

         moveLeft() {
             this.x = this.x - 2;
         }

         moveRight() {
             this.x = this.x + 2;
         }
     }
 }