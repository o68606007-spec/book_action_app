import { memo, FC, createContext, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Field, Input, Stack, Flex, Card, Box } from "@chakra-ui/react";
import { useNavigate, Link } from "react-router-dom";

import {
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../libs/firebase";

type LoginFormData = {
    email: string;
    password: string;
}

export const Login: FC = memo(() => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

    const onSubmit = handleSubmit(async (data: LoginFormData) => {

        await signInWithEmailAndPassword(
                auth,
                data.email,
                data.password
            );
        navigate("/home"); 
    });

    return (
        <>
        <Flex minH="100vh" justify="center" align="center">
            <Card.Root w="400px">
                <Card.Body textAlign="center">
                    <h2>Book-Action-App Login</h2>
                    <form onSubmit={onSubmit}>
                    <Stack gap="4" align="flex-start" maxW="sm">
                        <Field.Root invalid={!!errors.email} data-testid="email-field">
                            <label htmlFor="email">
                                メールアドレス <Field.RequiredIndicator />
                            </label>
                            <Input id="email" type="email" {...register("email", {required: "内容の入力は必須です",
                            })} />
                            {errors.email && <div data-testid="email-error">{errors.email.message as string}</div>}
                        </Field.Root>
                        <Field.Root invalid={!!errors.password} data-testid="password-field">
                            <label htmlFor="password">
                                パスワード <Field.RequiredIndicator />
                            </label>
                            <Input id="password" type="password" {...register("password", {required: "内容の入力は必須です",
                            })} />
                            {errors.password && <div data-testid="password-error">{errors.password.message as string}</div>}
                        </Field.Root>
                        <Button type="submit" colorScheme="blue">
                            送信
                        </Button>
                    </Stack>
                    </form>
                    <Box textAlign="center">
                    <Link to="/signup" data-testid="signup-link">
                        新規登録はこちら
                    </Link>
                    </Box>
                </Card.Body>
            </Card.Root>
        </Flex>
        </>
    )
    }    
)