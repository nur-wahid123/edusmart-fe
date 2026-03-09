import { UnitStatus } from "@/enums/unit-status.enum";
import { MapObject } from "./map.object";
import { UnitCategoryObject } from "./unit-category.object";


export class VisualDataDto {
    label?: string;
    color?: string;
    points?: number[];
}


export class UnitObject{
    id?: string;
    unit_number?: string;
    status?: UnitStatus;
    public image?: number;
    visual_data?: VisualDataDto; 
    additional_properties?: { key: string, value: string }[];
    price_override?: number;
    map?: MapObject;
    category?: UnitCategoryObject;

}