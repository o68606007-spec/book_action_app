import { supabase } from "../utils/supabase"

export const getLearningsTableLib = async () => {
    const getLearningsData = await supabase.from("learnings").select("*");
    if (getLearningsData.error) {
        console.error(getLearningsData.error);
        return null;
    };
    return getLearningsData;
}