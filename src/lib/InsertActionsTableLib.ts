import { supabase } from "../utils/supabase"


type actionsData = {
    actionContent: string,
    learning_Id: number,
    frequency: string
}

export const insertActionsTableLib = async ({actionContent, learning_Id, frequency}: actionsData) => {
    const insertActionsData = await supabase.from("actions").insert([{actionContent, learning_Id, frequency}]);
    if (insertActionsData.error) {
        console.error(insertActionsData.error);
        return null;
    };
    return insertActionsData;
}