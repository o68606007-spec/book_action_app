import { supabase } from "../utils/supabase"

export const getBookUserTableLib = async (email: string) => {
    const getBookUserData = await supabase.from("book-users").select("*").eq("email", email).single();
    if (getBookUserData.error) {
        console.error(getBookUserData.error);
        return null;
    };
    return getBookUserData;
}