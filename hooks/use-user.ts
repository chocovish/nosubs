import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { use, useEffect, useState } from "react";

export const useUser = () => {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchUserImage = async () => {
          const { data, error } = await createClient().auth.getSession()
          if (error) {
            console.error(error)
          }
          if (data.session?.user) setUser(data.session?.user)
        }
        fetchUserImage()
      }, [])
      return user;
};