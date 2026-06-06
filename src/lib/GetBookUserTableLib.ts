import { supabase } from "../utils/supabase"

export const getBookUserTableLib = async () => {
    const getBookUserData = await supabase.from("book-users").select("*");
    if (getBookUserData.error) {
        console.error(getBookUserData.error);
        return null;
    };
    return getBookUserData;
}