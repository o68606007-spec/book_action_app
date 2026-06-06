import { memo, FC, useCallback} from "react";
import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export const GoHomeButton: FC = memo(() => {
    const navigate = useNavigate();

    const handleGoHome = useCallback(() => {
        navigate("/home");
    }, [navigate]);

    return (
        <Button colorScheme="blue" size="sm" width="fit-content" onClick={handleGoHome}>
            ホーム画面に戻る
        </Button>
    )
})