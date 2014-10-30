module Bomber {

    export class UserJoinedData {
        public name: string;
        public x: number;
        public y: number;
        //Later use
        public skinName: string;

        constructor(n: string, pos: IPositionableElement, skin: string = "bomberman") {
            this.name = n;
            this.x = pos.x;
            this.y = pos.y;
            this.skinName = skin;
        }
    }

    export class MovementData {
        public typeMov: MovementType;
        public finishingX: number;
        public finishingY: number;
        public name: string;

        constructor(typ: MovementType, pos: IPositionableElement, name: string) {
            this.finishingX = pos.x;
            this.finishingY = pos.y;
            this.typeMov = typ;
            this.name = name;
        }

    }

    export class StopData {
        public name: string;
        public x: number;
        public y: number;

        constructor(position: IPositionableElement) {
            this.x = position.x;
            this.y = position.y;
        }
    }

    export interface IPositionableElement {
        x: number;
        y: number;
    }


    export enum MovementType {
        Down = 0,
        Up,
        Left,
        Right,
        Teleportation
    }
} 