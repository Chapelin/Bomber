module Bomber {
    
    export class MovementData {
        public typeMov: MovementType;
        public finishingX: number;
        public finishingY: number;

        constructor(typ: MovementType,pos : IPositionableElement) {
            this.finishingX = pos.x;
            this.finishingY = pos.y;
            this.typeMov = typ;
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