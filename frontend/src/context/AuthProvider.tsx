import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { academicYear, user } from "@/types";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<user | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState<academicYear | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        const [profileRes, yearRes] = await Promise.all([
          api.get("/users/profile"),
          api.get("/academic-years/current"),
        ]);

        setUser(profileRes.data.user);
        setYear(yearRes.data);
      } catch (error) {
        console.log(error);
        setUser(null);
        setYear(null);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, year }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
