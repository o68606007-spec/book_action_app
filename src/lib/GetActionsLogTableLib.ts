import { supabase } from "../utils/supabase"

export const getActionsLogTableLib = async (firebase_uid: string) => {
    const getActionsLogData = await supabase.from("action_logs").select(`*, actions(content, firebase_uid)`).eq("actions.firebase_uid", firebase_uid);
    if (getActionsLogData.error) {
        console.error(getActionsLogData.error);
        return null;
    };
    return {
        ...getActionsLogData,
        data: getActionsLogData.data?.filter(
            log => log.actions?.firebase_uid === firebase_uid
        )
    };
}