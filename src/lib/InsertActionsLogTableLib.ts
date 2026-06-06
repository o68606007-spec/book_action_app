import { supabase } from "../utils/supabase"

export const insertActionsLogTableLib = async (todoId: number) => {
    const today = new Date().toISOString().split("T")[0];
    const existingLog = await supabase.from("action_logs").select("*").eq("action_id", todoId).eq("executed_at", today).single();
    if (existingLog.data) {
        return {
            status: "already_exists",
        };
    }
    const insertData = await supabase.from("action_logs").insert({action_id: todoId, executed_at:today, is_done: true });
    if (insertData.error) {
        return {
            status: "error",
            error: insertData.error,
        };
    }
    return {
        status: "success",
    };
}