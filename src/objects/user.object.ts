import { RoleEnum } from "@/enums/role.enum";
import { SchoolObject } from "./school.object";
import { CommonBaseObject } from "./common.object";

export interface UserObject extends CommonBaseObject {
  id?: number;

  name?: string;

  username?: string;

  password?: string;

  email?: string;

  user_type?: RoleEnum;

  school?: SchoolObject;

}
