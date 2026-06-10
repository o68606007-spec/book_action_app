import { memo, FC, useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Field, Input, Stack, HStack, Box, Flex } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import { useAuthContext } from "../context/AuthContext";
import { Dialogs } from "./Dialog";
import { supabase } from "../utils/supabase";
import { getBookTitleTableLib } from "../lib/GetBookTitleTableLib";
import { getLearningsContentTableLib } from "../lib/GetLearningsContentTableLib";
import { insertBookTableLib } from "../lib/InsertBookTableLib";
import { insertLearningsTableLib } from "../lib/InsertLearningsTableLib";
import { LogoutButton } from "./atom/LogoutButton";

type FormValues = {
    title: string;
    content: string;
}

export const BookId: FC = memo((props) => {
    const { user } = useAuthContext();
    const { bookId } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [learningId, setLearningId] = useState<number | null>(null);

    const onSubmit = handleSubmit (async (data) => {
        let currentBookId = Number(bookId);
        if (bookId === "new") {
            const registerBook = await insertBookTableLib(user, data.title);
            currentBookId = registerBook?.data.id;
        }
        const learningsData = await insertLearningsTableLib(data.content, currentBookId);
        setLearningId(learningsData?.data.id);
        setIsDialogOpen(true);
    })

    const handleBook = useCallback(() => {
        navigate(`/book`);
    }, [navigate]);

    useEffect(() => {
        const fetchBookData = async () => {
            if (bookId === "new") {
                return;
            }
            const bookTitleData = await getBookTitleTableLib(Number(bookId));
            const bookContentData = await getLearningsContentTableLib(Number(bookId));
            reset({
                title: bookTitleData?.data.title,
                content: bookContentData?.data.content || "",
            })
        };
        fetchBookData();
    },[bookId, reset])

    return (
        <>
        <Flex minH="100vh" justify="center" align="center">
        <Box maxW="800px" mx="auto" p={6}>
            <h2>本詳細</h2>
            <form onSubmit={onSubmit}>
            <Stack gap="4" align="flex-start" maxW="sm">
                <Field.Root invalid={!!errors.title} data-testid="title">
                    <label htmlFor="title">
                        本のタイトル <Field.RequiredIndicator />
                    </label>
                    <Input id="title" type="string" {...register("title", {required: "内容の入力は必須です",
                    })} />
                    {errors.title && <div>{errors.title.message as string}</div>}
                </Field.Root>
                <Field.Root invalid={!!errors.content} data-testid="content">
                    <label htmlFor="content">
                        学んだ内容 <Field.RequiredIndicator />
                    </label>
                    <Input id="content" type="string" {...register("content", {required: "内容の入力は必須です",
                    })} />
                    {errors.content && <div>{errors.content.message as string}</div>}
                </Field.Root>
                <HStack justify="space-between" width="100%">
                    <Button type="submit" colorScheme="blue">
                    行動に変換
                    </Button>
                    <Button colorScheme="blue" onClick={() => handleBook()}>
                    本一覧画面に戻る
                    </Button>
                </HStack>
            </Stack>
            </form>
            {learningId && isDialogOpen && (<Dialogs open={isDialogOpen} setOpen={setIsDialogOpen} learningId={learningId} />)}
            <LogoutButton />
        </Box>
        </Flex>
        </>
    )
    }    
)