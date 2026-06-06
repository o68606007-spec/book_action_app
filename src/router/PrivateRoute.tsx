import {  Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuthContext } from "../context/AuthContext";

type PrivateRouteProps = {
    children: ReactNode;
}


export const PrivateRoute = (props: PrivateRouteProps) => {
    const { children } = props;
    const { user } = useAuthContext();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

