import React, { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Storage from "../services/localStorage";

const ProtectedRoute: any = (props: {
    children: ReactNode,
    user: any,
    redirectPage: string
}): any => {
    const { children,  redirectPage } = props;
    if (!Storage.getUserData()) {
        return <Navigate to={redirectPage} replace />;
    }
    return children ? children : <Outlet />;
};

export default ProtectedRoute;