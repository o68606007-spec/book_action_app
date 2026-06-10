import { memo, FC, useEffect, useState, useCallback } from "react";
import { Checkbox, VStack, Text, Box, Button, HStack } from "@chakra-ui/react";
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
    firebase_uid: string;
    title: string;
};

type ActionData = {
    id: number;
    content: string;
    frequency: string;
    learning_id: number;
    firebase_uid: string;
    learnings: {
        id: number;
        book_id: number;
        books: {
        title: string;
        };
    };
};

export const Home: FC = memo(() => {
    const { user } = useAuthContext();

    const [userName, setUserName] = useState<string>("");
    const [todos, setTodos] = useState<Todo[]>([]);

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
            const userNameData = await getBookUserTableLib(user?.email);
            if (userNameData?.data) {
                setUserName(userNameData?.data.name);
            }
            
            const data = await getActionsTableLib(userNameData?.data.firebase_uid);
            if (data?.data) {
                const todos = (data.data as ActionData[]).map((item) => ({
                    id: item.id,
                    content: item.content,
                    learning_id: item.learning_id,
                    frequency: item.frequency,
                    firebase_uid: item.firebase_uid,
                    title: item.learnings?.books?.title ?? "",
                }));
                setTodos(todos);
            }
        };
        fetchData();
        document.body.style.pointerEvents = "";

        document.body.removeAttribute("data-inert");
        document.body.removeAttribute("data-scroll-lock");
    },[])

    return (
        <>
        <Box maxW="800px" mx="auto" p={6}>
            <h2>ホーム</h2>
            <p>ようこそ,{userName}さん</p>
            <p>本日のTODOリスト</p>
            <VStack align="stretch">
            {todos.map((todo) => (
                <Box key={todo.id} borderWidth="1px" borderRadius="md" p={4} onClick={() => handleCheck(todo.id)} >
                    <Checkbox.Root>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                        <VStack align="start">
                            <Text fontWeight="bold">
                                行動内容: {todo.content}
                            </Text>

                            <Text>
                                📖 本: {todo.title}
                            </Text>

                            <Text>
                                🔁 頻度: {todo.frequency}
                            </Text>
                            </VStack>
                    </Checkbox.Root>
                </Box>
            ))}
            </VStack>
            <HStack justify="center" mt={4}>
                <Button asChild w="180px">
                    <Link to="/book">
                    本一覧画面はこちら
                    </Link>
                </Button>

                <Button asChild w="180px">
                    <Link to="/analysis">
                    継続分析画面はこちら
                    </Link>
                </Button>

                <LogoutButton />
            </HStack>
        </Box>
        </>
    )
    }    
)