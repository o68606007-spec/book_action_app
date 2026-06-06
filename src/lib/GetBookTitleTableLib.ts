import { supabase } from "../utils/supabase"

export const getBookTitleTableLib = async (bookId: number) => {
    const bookTitleData = await supabase.from("books").select().eq("id", bookId).single();
    if (bookTitleData.error) {
        console.error("Error fetching data:", bookTitleData.error);
        return null;
    }
    return bookTitleData;
}