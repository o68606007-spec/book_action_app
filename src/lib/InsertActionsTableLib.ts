import { supabase } from "../utils/supabase"


type actionsData = {
    content: string,
    learning_id: number,
    frequency: string,
    firebase_uid: string
}

export const insertActionsTableLib = async ({content, learning_id, frequency, firebase_uid}: actionsData) => {
    const insertActionsData = await supabase.from("actions").insert([{content, learning_id, frequency, firebase_uid}]);
    if (insertActionsData.error) {
        console.error(insertActionsData.error);
        return null;
    };
    return insertActionsData;
}