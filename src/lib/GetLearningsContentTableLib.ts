import { supabase } from "../utils/supabase"

export const getLearningsContentTableLib = async (bookId: number) => {
    const bookContentData = await supabase.from("learnings").select().eq("book_id", bookId);
    if (bookContentData.error) {
        console.error("Error fetching data:", bookContentData.error);
        return null;
    }
    return bookContentData;
}