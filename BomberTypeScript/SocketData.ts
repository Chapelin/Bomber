module Bomber {
    
    export class MovementData {
        public typeMov: MovementType;
        public finishingX: number;
        public finishingY: number;
        public name : string;

        constructor(typ: MovementType,pos : IPositionableElement, name : string) {
            this.finishingX = pos.x;
            this.finishingY = pos.y;
            this.typeMov = typ;
            this.name = name;
        }

    }

    export interface IPositionableElement {
        x: number;
        y : number;
    }


    export enum MovementType {
        Down = 0,
        Up,
        Left,
        Right
    }
} 