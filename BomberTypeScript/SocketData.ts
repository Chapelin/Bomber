module Bomber {

    export class BaseData {
        public timeStampCreated: number;
        public timeStampSended: number;
        public timeStampServerReceived: number;
        public timeStampServerBroadcasted : number;

        constructor() {
            this.timeStampCreated = new Date().getTime();
        }

        public setTimeStampSended() {
            this.timeStampSended = new Date().getTime();
        }
        public setTimeStampServerReceived() {
            this.timeStampServerReceived = new Date().getTime();
        }
        public setTimeStampServerBroadcasted() {
            this.timeStampServerBroadcasted = new Date().getTime();
        }
    }

    export class UserJoinedData extends BaseData {
        public name: string;
        public x: number;
        public y: number;
        //Later use
        public skinName: string;

        constructor(n: string, pos: IPositionableElement, skin: string = "bomberman") {
            super();
            this.name = n;
            this.x = pos.x;
            this.y = pos.y;
            this.skinName = skin;
        }
    }

    export class MovementData extends BaseData {
        public typeMov: MovementType;
        public finishingX: number;
        public finishingY: number;
        public name: string;

        constructor(typ: MovementType, pos: IPositionableElement, name: string) {
            super();
            this.finishingX = pos.x;
            this.finishingY = pos.y;
            this.typeMov = typ;
            this.name = name;
        }

    }

    export class StopData extends BaseData {
        public name: string;
        public x: number;
        public y: number;

        constructor(position: IPositionableElement) {
            super();
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
        Teleportation,
        Collided
    }
}