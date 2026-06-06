import { supabase } from "../utils/supabase"

export const getActionsLogTableLib = async () => {
    const getActionsLogData = await supabase.from("action_logs").select(`*, actions(content)`);
    if (getActionsLogData.error) {
        console.error(getActionsLogData.error);
        return null;
    };
    return  getActionsLogData;
}