import { supabase } from "../utils/supabase"

export const getActionIndividualTableLib = async (firebase_uid: string) => {
    const getActionIndividualData = await supabase.from("actions").select("*").eq("firebase_uid", firebase_uid);
    
    if (getActionIndividualData.error) {
        console.error(getActionIndividualData.error);
        return null;
    };
    return getActionIndividualData;
}