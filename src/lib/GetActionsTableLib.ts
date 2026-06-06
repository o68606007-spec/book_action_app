import { supabase } from "../utils/supabase"

export const getActionsTableLib = async () => {
    const getActionsData = await supabase.from("actions").select("*");
    if (getActionsData.error) {
        console.error(getActionsData.error);
        return null;
    };
    return getActionsData;
}