import { supabase } from "../utils/supabase"

export const getBookTableLib = async (uid: string) => {
    const getBookData = await supabase.from("books").select("*").eq("user_id", uid);
    if (getBookData.error) {
        console.error(getBookData.error);
        return null;
    };
    return getBookData;
}