import { supabase } from "../utils/supabase"

export const insertLearningsTableLib = async (content: string, book_id: number) => {
    const learningsData = await supabase.from("learnings").insert({ content, book_id }).select().single()
    if (learningsData.error) {
    console.error("Error inserting data:", learningsData.error);
    return null;
    }
    return learningsData;
}