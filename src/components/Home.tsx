import { memo, FC, useEffect, useState, useCallback } from "react";
import { Checkbox, VStack, Box  } from "@chakra-ui/react";
import { Link } from "react-router-dom";

import { useAuthContext } from "../context/AuthContext";
import { getActionsTableLib } from "../lib/GetActionsTableLib";
import { getBookUserTableLib } from "../lib/GetBookUserTableLib";
import { insertActionsLogTableLib } from "../lib/InsertActionsLogTableLib";
import { LogoutButton } from "./atom/LogoutButton";
import { supabase } from "../utils/supabase";

type Todo = {
    id: number;
    content: string;
    learning_id: number;
    frequency: string;
};

export const Home: FC = memo(() => {
    const { user } = useAuthContext();

    const [userName, setUserName] = useState<string>("");
    const [todos, setTodos] = useState<Todo[]>([])

    const handleCheck = useCallback(async (todoId: number) => {
        const result = await insertActionsLogTableLib(todoId);

        if (result?.status === "already_exists") {
            alert("既に本日の行動は記録されています");
            return;
        }
        if (result?.status === "error") {
            console.error(result.error);
            return;
        }
        alert("行動が記録されました");
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getActionsTableLib();
                if (data?.data) {
                    setTodos(data?.data);
                }
            const userNameData = await getBookUserTableLib();
                if (userNameData?.data) {
                    const foundUser = userNameData.data.find((item) => item.firebase_id === user?.uid);
                    if (foundUser) {
                        setUserName(foundUser.name);
                    }

                }
        };
        fetchData();
    },[])

    return (
        <>
            <h1>ホーム</h1>
            <p>Welcome,{userName}</p>
            <p>本日のTODOリスト</p>
            <VStack align="stretch">
            {todos.map((todo) => (
                <Box key={todo.id} borderWidth="1px" borderRadius="md" p={4} onClick={() => handleCheck(todo.id)} >
                    <Checkbox.Root>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <label>
                        行動内容: {todo.content}
                    </label>
                    </Checkbox.Root>
                    <p>頻度: {todo.frequency}</p>
                </Box>
            ))}
            </VStack>
            <Link to="/book">本一覧画面はこちら</Link>
            <Link to="/analysis">継続分析画面はこちら</Link>
            <LogoutButton />
        </>
    )
    }    
)