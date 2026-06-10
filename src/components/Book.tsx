import { memo, FC, useCallback, useEffect, useState } from "react";
import { Button, Card, HStack, Text, Box, Flex } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "../context/AuthContext";
import { getBookTableLib } from "../lib/GetBookTableLib";
import { deleteBookTableLib } from "../lib/DeleteBookTableLib";
import { supabase } from "../utils/supabase";
import { GoHomeButton } from "./atom/GoHomeButton";
import { LogoutButton } from "./atom/LogoutButton";

type BookType = {
    id: number;
    title: string;
}

export const Book: FC = memo(() => {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const [books, setBooks] = useState<BookType[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getBookTableLib(user?.uid);
            if (data?.data) {
                setBooks(data.data);
            }
        }
        fetchData();
    },[])

    const handleChange = useCallback((bookId: number) => {
        navigate(`/book/${bookId}`);
    },[navigate])

    const handleDelete = useCallback(async (bookId: number) => {
        const deleteData = await deleteBookTableLib(String(bookId));
        if (deleteData) {
            alert("削除に成功しました");
        } else {
            alert("削除に失敗しました");
        }
        setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    },[navigate])

    const handleAdd = useCallback(() => {
        navigate(`/book/new`);
    }, [navigate]);

    return (
        <>
        <Box maxW="800px" mx="auto" p={6}>
            <h2>本一覧</h2>
            <Flex wrap="wrap" gap={4}>
            {books.map((book) => (
                <div key={book.id}>
                <Card.Root width="320px">
                    <Card.Body gap="2">
                        <Card.Title mt="2">{book.title}</Card.Title>
                        <Card.Description></Card.Description>
                    </Card.Body>
                        <Card.Footer justifyContent="flex-end">
                            <Button variant="outline" onClick={() => handleChange(book.id)}>
                                追加
                            </Button>
                            <Button variant="outline" onClick={() => handleDelete(book.id)}>
                                削除
                            </Button>
                        </Card.Footer>
                    </Card.Root>
                </div>
            ))}
            </Flex>
            <HStack justify="space-between" width="100%">
                <Button colorScheme="blue" onClick={() => handleAdd()}>
                    本を追加
                </Button>
                <GoHomeButton />
            </HStack>
            <LogoutButton />
        </Box>
        </>
    )
    }    
)