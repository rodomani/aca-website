import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

type Access = {
  loading: boolean;
  userId: string | null;
  isAdmin: boolean;
  error: boolean;
};
export function useAdmin(): Access {
  const [access, setAccess] = useState<Access>({
    loading: true,
    userId: null,
    isAdmin: false,
    error: false,
  });
  useEffect(() => {
    let active = true;
    let version = 0;
    let timer: ReturnType<typeof setTimeout>;
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const request = ++version;
      clearTimeout(timer);
      const userId = session?.user.id ?? null;
      setAccess({ loading: !!userId, userId, isAdmin: false, error: false });
      if (!userId) return;
      timer = setTimeout(() => {
        void (async () => {
          try {
            const { data, error } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", userId)
              .maybeSingle();
            if (active && request === version)
              setAccess({
                loading: false,
                userId,
                isAdmin: !error && data?.role === "admin",
                error: !!error,
              });
          } catch {
            if (active && request === version)
              setAccess({
                loading: false,
                userId,
                isAdmin: false,
                error: true,
              });
          }
        })();
      }, 0);
    });
    return () => {
      active = false;
      ++version;
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);
  return access;
}
