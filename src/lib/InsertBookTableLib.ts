import { supabase } from "../utils/supabase"

export const insertBookTableLib = async (user: any, title: string) => {
    const registerBook = await supabase.from("books").insert({ user_id: user?.uid, title }).select().single();
    if (registerBook.error) {
        console.error("Error inserting data:", registerBook.error);
        return null;
    }
    return registerBook;
}