import { CommonBaseObject } from "./common.object";
import { UserObject } from "./user.object";

export class ImpersonationLogObject extends CommonBaseObject {
    id?: number;
    admin?: UserObject;
    target_user?: UserObject;
    reason?: string;
}