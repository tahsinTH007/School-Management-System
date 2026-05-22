import { createContext } from "react";
import type { academicYear, user } from "@/types";

export type AuthContextType = {
  user: user | null;
  setUser: React.Dispatch<React.SetStateAction<user | null>>;
  loading: boolean;
  year: academicYear | null;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
  year: null,
});
