import { supabase } from "../utils/supabase"


type insertData = {
    user_id: string,
    firebase_uid: string,
    email: string | null,
    name: string
}

export const insertBookUsersTableLib = async ({user_id, firebase_uid, email, name}: insertData) => {

    // const exsistingUser = await supabase.from("book-users").select("*").eq("firebase_id", firebase_uid).single();
    // if (exsistingUser.data) {
    //     return {
    //         status: "exsisting_user",
    //     };
    // }

    const registerBookUsers = await supabase.from("book-users").insert({ user_id, firebase_uid, email, name });
    if (registerBookUsers.error) {
        console.error("Error inserting data:", registerBookUsers.error);
        return null;
    }
    return {
        status: "success",
    };
}