import { RoleEnum } from "@/enums/role.enum";
import { UserInfo } from "@/objects/user-info.object";
import { createContext } from "react";

export const AppContext = createContext<{
  user: UserInfo;
  isLoading: boolean;
  refreshData: () => void;
  error: string | null;
}>({
  error: "",
  user: {
    username: "",
    name: "",
    sub: 0,
    email: "",
    user_type: RoleEnum.TEACHER,
  },
  isLoading: true,
  refreshData: () => {},
});
