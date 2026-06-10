import { memo, FC, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Field, Input, Stack, HStack, Card, Box, Flex} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
} from "firebase/auth";

import { supabase } from "../utils/supabase"
import { auth } from "../libs/firebase";
import { insertBookUsersTableLib } from "../lib/InsertBookUsersTableLib";

type FormData = {
    email: string;
    name: string;
    password: string;
}


export const Signup: FC = memo(() => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onSubmit = useCallback(handleSubmit(async (data: FormData) => {
        // Firebase Auth登録
        const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    data.email,
                    data.password
                );

        const firebaseUser = userCredential.user;

        const registerBookUsers = await insertBookUsersTableLib({user_id: firebaseUser.uid, firebase_uid: firebaseUser.uid, email: firebaseUser.email, name: data.name });
        if (registerBookUsers?.status === "exsisting_user") {
            alert("既に登録されているユーザーです");
            return;
        }
        
        if (registerBookUsers?.status === "success") {
            alert("ユーザーの登録が完了しました");
            navigate("/home"); 
        }
    }),[navigate]);

    return (
        <>
        <Flex minH="100vh" justify="center" align="center">
            <Card.Root w="400px">
                <Card.Body textAlign="center">
                    <h2>新規登録</h2>
                    <form onSubmit={onSubmit}>
                    <Stack gap="4" align="flex-start" maxW="sm">
                        <Field.Root invalid={!!errors.email} data-testid="email">
                            <label htmlFor="email">
                                メールアドレス <Field.RequiredIndicator />
                            </label>
                            <Input id="email" type="email" {...register("email", {required: "内容の入力は必須です",
                            })} />
                            {errors.email && <div data-testid="email-error">{errors.email.message as string}</div>}
                        </Field.Root>
                        <Field.Root invalid={!!errors.name} data-testid="name">
                            <label htmlFor="name">
                                名前 <Field.RequiredIndicator />
                            </label>
                            <Input id="name" type="string" {...register("name", {required: "内容の入力は必須です",
                            })} />
                            {errors.name && <div data-testid="name-error">{errors.name.message as string}</div>}
                            </Field.Root>
                        <Field.Root invalid={!!errors.password} data-testid="password">
                            <label htmlFor="password">
                                パスワード <Field.RequiredIndicator />
                            </label>
                            <Input id="password" type="password" {...register("password", {required: "内容の入力は必須です", minLength: {value: 6, message: "6文字以上記入してください"}
                            })} />
                            {errors.password && <div data-testid="password-error">{errors.password.message as string}</div>}
                        </Field.Root>
                    <HStack justify="space-between" width="100%">
                        <Button type="submit" colorScheme="blue">
                            送信
                        </Button>
                        <Button onClick={() => navigate("/login")} colorScheme="blue" gap="4" size="sm" width="fit-content">
                            ログインへ戻る
                        </Button>
                    </HStack>
                        </Stack>
                    </form>
                </Card.Body>
            </Card.Root>
        </Flex>
        </>
    )
})