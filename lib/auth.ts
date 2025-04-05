import { createClient } from "./supabase/server";

export const auth = async () => {
    const supabase = await createClient();
    const user = await supabase.auth.getUser();
    return user.data?.user;
}

export const requireAuth = async () => {
    const user = await auth();
    if (!user) {
        throw new Error('Unauthorized');
    }
    return user;
}