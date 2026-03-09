import { UnitObject } from "./unit.object";

export class MapObject {
        public id?: number;
        public title?: string;
        public width?: number;
        public height?: number;
        public image?: number;
        public units?: UnitObject[];
        public description?: string;
}