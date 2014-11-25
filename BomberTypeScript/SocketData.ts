module Bomber {
    var CarriageReturn = "\r\n";

    export class BaseData {
        public timeStampCreated: number;
        public timeStampSended: number;
        public timeStampServerReceived: number;
        public timeStampServerBroadcasted: number;

        constructor() {
            this.timeStampCreated = new Date().getTime();
        }

        public static ToString(data: BaseData): string {
            var contenu = "";
            if (data.timeStampCreated)
                contenu += "Created : " + data.timeStampCreated + CarriageReturn;
            if (data.timeStampSended)
                contenu += "Sended : " + data.timeStampSended + CarriageReturn;;
            if (data.timeStampServerReceived)
                contenu += "Received by server : " + data.timeStampServerReceived + CarriageReturn;;
            if (data.timeStampServerBroadcasted)
                contenu += "Broadcasted by server : " + data.timeStampServerBroadcasted + CarriageReturn;
            return contenu;
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

        public static ToString(data: UserJoinedData): string {
            var contenu = "User Joined" + CarriageReturn;
            contenu += BaseData.ToString(data);
            contenu += "Name : " + data.name + CarriageReturn;
            contenu += "skinName : " + data.skinName + CarriageReturn;
            contenu += "x,y : " + data.x + " | " + data.y + CarriageReturn;
            return contenu;

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

        public static ToString(data: MovementData): string {
            var contenu = "User moved" + CarriageReturn;
            contenu += BaseData.ToString(data);
            contenu += "Type movement : " + data.typeMov + CarriageReturn;
            contenu += "Name : " + data.name + CarriageReturn;
            contenu += "Position : " + data.finishingX + " | " + data.finishingY + CarriageReturn;
            return contenu;
        }

    }

    export class CreatedData extends BaseData {
        public name: string;

        constructor(name: string) {
            super();
            this.name = name;
        }

        public static ToString(data: CreatedData): string {
            var contenu = "User Created" + CarriageReturn;
            contenu += BaseData.ToString(data);
            contenu += "Name : " + name + CarriageReturn;
            return contenu;
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

        public static ToString(data: StopData): string {
            var contenu = "User stopped" + CarriageReturn;
            contenu += BaseData.ToString(data);
            contenu += "Name : " + name + CarriageReturn;
            contenu += "Position : " + data.x + " | " + data.y + CarriageReturn;
            return contenu;
        }
    }

    export class QuittedData extends BaseData {
        public name;

        constructor(n: string) {
            super();
            this.name = n;
        }

        public static ToString(data: QuittedData): string {
            var contenu = "User quitted" + CarriageReturn;
            contenu += BaseData.ToString(data);
            contenu += "Name : " + name + CarriageReturn;
            return contenu;

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