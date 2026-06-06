import { supabase } from "../utils/supabase"

export const deleteBookTableLib = async (bookId: string) => {
    const deleteBookData = await supabase.from("books").delete().eq("id", bookId);
    if (deleteBookData.error) {
        console.error(deleteBookData.error);
        return null;
    };
    return deleteBookData;
}