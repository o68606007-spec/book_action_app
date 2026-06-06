import { supabase } from "../utils/supabase"

export const getBookTableLib = async () => {
    const getBookData = await supabase.from("books").select("*");
    if (getBookData.error) {
        console.error(getBookData.error);
        return null;
    };
    return getBookData;
}