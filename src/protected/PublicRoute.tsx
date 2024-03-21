import React, { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";
import RouteList from "../constants/Routes.constant";
import Storage from "../services/localStorage";

const PublicRoute: any = (props: {
    children: ReactNode,
    user: any,
}): any => {
    const { children } = props;
    if (Storage.getUserData()) {
        const dashboard = RouteList.DASHBOARD.split('/').filter((x: string) => x != '*').join('')
        return <Navigate to={`/${dashboard}`} replace />;
    }
    return children ? children : <Outlet />;
};

export default PublicRoute;