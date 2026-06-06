import { memo, FC, useCallback, useEffect, useState } from "react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../libs/firebase";

export const LogoutButton: FC = memo(() => {
    const navigate = useNavigate();

    const handleLogout = useCallback(async () => {
        await signOut(auth)
        navigate("/login");
    }, [navigate]);

    return (
        <Button colorScheme="blue" size="sm" width="fit-content" onClick={handleLogout}>
            Logout
        </Button>
    )
})