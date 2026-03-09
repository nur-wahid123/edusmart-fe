import { UnitObject } from "./unit.object";

export class UnitCategoryObject{
    public id?: number;
    public name?: string;
    public imageId?: number;
    public type?: string;
    public base_price?: string;
    additional_properties?: { key: string, value: string }[]; // Array of object: { key: string, value: any }
    units?: UnitObject[];
    public description?: string;
}