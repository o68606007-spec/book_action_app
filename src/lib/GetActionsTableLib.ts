import { supabase } from "../utils/supabase"

export const getActionsTableLib = async (firebase_uid: string) => {
    const getActionsData = await supabase.from("actions").select(`id, 
        content, 
        frequency, 
        learning_id, 
        firebase_uid,
        learnings (
            id,
            book_id,
            books (
                title
            )
        )
  `).eq("firebase_uid", firebase_uid).order("created_at", { ascending: false });
    
    if (getActionsData.error) {
        console.error(getActionsData.error);
        return null;
    };
    return getActionsData;
}