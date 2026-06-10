import { memo, FC, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, Input, Group, Dialog, Portal, CloseButton, useDisclosure, VStack, HStack } from '@chakra-ui/react';

import { useAuthContext } from "../context/AuthContext";
import { supabase } from "../utils/supabase";
import { insertActionsTableLib } from "../lib/InsertActionsTableLib";

type DialogProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    learningId: number | null;
}

type FormValues = {
    content: string;
    frequency: string;
}

export const Dialogs: FC<DialogProps> = memo((prop) => {
    const { user } = useAuthContext();
    const { open, setOpen, learningId } = prop
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>();
    const navigate = useNavigate();

    const onOpenChange = (event: { open: boolean }) => {
        setOpen(event.open);
    }

    const onSubmit = useCallback(async (data: FormValues) => {
        if (!learningId) {
            console.error("Invalid learning ID");
            return;
        }

        const registerData = await insertActionsTableLib({ content: data.content, learning_id: learningId, frequency: data.frequency, firebase_uid: user.uid });

        setOpen(false);
        reset();
        requestAnimationFrame(() => {
            navigate("/home");
        });
        }, [setOpen, reset])

    return (
        <>
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner {...({} as any)}>
                <Dialog.Content as="form" onSubmit={handleSubmit(onSubmit)} {...({} as any)}>
                    <Dialog.Header>
                        <Dialog.Title data-testid="add-title" {...({} as any)}>行動記録</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body>
                        <Group attached w="fall" maxW="lg">
                            <VStack align="stretch">
                            <Input type="text" {...register("content", {required:"内容の入力は必須です",})} data-testid="content-input"/>
                                    {errors.content && <p style={{ color: "red" }} data-testid="actionContent-error">{errors.content.message}</p>}
                            <br />
                            <HStack gap={4}>
                                <label htmlFor="frequency" data-testid="frequency-label">頻度:</label>
                                <select id="frequency" {...register("frequency")} data-testid="frequency-select">
                                    <option value="daily">毎日</option>
                                    <option value="weekly">毎週</option>
                                    <option value="monthly">毎月</option>
                                </select>
                            </HStack>
                            </VStack>
                        </Group>
                    </Dialog.Body>
                    <Dialog.Footer>
                        <Button colorScheme="teal" width="100px" type="submit">登録</Button>                        
                        <Dialog.ActionTrigger asChild>
                            <Button colorScheme="teal" width="100px">キャンセル</Button>
                        </Dialog.ActionTrigger>                            
                    </Dialog.Footer>
                    <Dialog.CloseTrigger asChild {...({} as any)}>
                        <CloseButton size="sm" />
                    </Dialog.CloseTrigger>
                </Dialog.Content>
            </Dialog.Positioner>
        </Portal>
        </Dialog.Root>
        </>
    )
});