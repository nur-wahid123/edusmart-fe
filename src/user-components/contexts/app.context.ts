import { RoleEnum } from "@/enums/role.enum";
import { UserInfo } from "@/objects/user-info.object";
import { createContext } from "react";

export const AppContext = createContext<{
  user: UserInfo;
  isLoading: boolean;
  refreshData: () => void;
  error: string | null;
  // setProfile: (name: string, email: string, username: string) => void;
}>({
  error: "",
  user: {
    username: "",
    name: "",
    sub: 0,
    email: "",
    role: RoleEnum.USER,
  },
  isLoading: true,
  refreshData: () => {},
  // setProfile: () => {},
});
