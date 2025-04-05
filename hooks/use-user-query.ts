'use client';

import { getUserProfile } from "@/app/actions/profile";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { User as UserProfile } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Query keys for caching
export const QUERY_KEYS = {
  user: "user",
  userProfile: "userProfile",
};

// Get authenticated Supabase user
const fetchUser = async (): Promise<User | null> => {
  const { data, error } = await createClient().auth.getSession();
  if (error) {
    console.error(error);
    return null;
  }
  return data.session?.user || null;
};

// Fetch user profile from database
const fetchUserProfile = async (): Promise<UserProfile | null> => {
  try {
    return await getUserProfile();
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// Hook for accessing the authenticated user
export const useUserQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.user],
    queryFn: fetchUser,
  });
};

// Hook for accessing the user profile
export const useUserProfileQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.userProfile],
    queryFn: fetchUserProfile,
  });
};

// Hook for invalidating user data
export const useInvalidateUserData = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateUserProfile: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userProfile] }),
    invalidateUser: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] }),
    invalidateAllUserData: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.user] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.userProfile] });
    }
  };
}; 