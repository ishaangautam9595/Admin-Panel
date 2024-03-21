import React, { lazy, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes as Switch,
} from "react-router-dom";
import { Loader } from "semantic-ui-react";
import Navbar from "./elements/Navbar";
import instance from "./services/api/index.service";
import { APP_SEC } from "./constants/enum";
import CryptoJSService from "./services/CryptoSecurity.service";
import { SERVER_ERROR } from "./constants/Constants";
import { toast } from "react-toastify";
import RouteList from "./constants/Routes.constant";
import AppRouteList from "./constants/ApiRoute.constant";
import "./App.css";
import { useDispatch } from "react-redux";
import ForgotPasswordSuccess from "./pages/ForgotPasswordSuccess";
import ResetPassword from "./pages/ResetPassword";
import CompaniessLayout from "./layout/CRMLayout";
const Login = lazy(() => import("./pages/Login"));
const Layout = lazy(() => import("./layout/Layout"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ProtectedRoute = lazy(() => import("./protected/ProtectedRoute"));
const PublicRoute = lazy(() => import("./protected/PublicRoute"));
const CoursesLayout = lazy(() => import("./layout/CoursesLayout"));
const App = () => {
  const dispatch = useDispatch();
  const [isLoadedKey, setIsLoadedKey] = useState<Boolean>(false);
  useEffect(() => {
    fetchAppInfo();
  }, []);
  const fetchAppInfo = async () => {
    try {
      const { data, status } = await instance.post<APP_SEC | any>(
        AppRouteList.GET_APP_INFO,
        {}
      );
      if (status === 200) {
        CryptoJSService.setSeckey(CryptoJSService.decryptBtoa(data.data._v));
        setIsLoadedKey(true);
      }
    } catch {
      toast.warn(SERVER_ERROR);
      setTimeout(() => fetchAppInfo(), 10000);
    }
  };
  return isLoadedKey ? (
    <Router>
      <Navbar dispatch={dispatch} />
      <Switch>
        <Route element={<PublicRoute redirectPage={RouteList.LOGIN_PAGE} />}>
          <Route path={RouteList.LOGIN_PAGE} element={<Login />} />
          <Route
            path={RouteList.FORGOT_PASSWORD}
            element={<ForgotPassword />}
          />
          <Route
            path={RouteList.FORGOTPASSWORDSUCCESS}
            element={<ForgotPasswordSuccess />}
          />
          <Route path={RouteList.RESET_PASSWORD} element={<ResetPassword />} />
        </Route>
        <Route element={<ProtectedRoute redirectPage={RouteList.LOGIN_PAGE} />}>
          <Route
            path={`${RouteList.DASHBOARD}/*`}
            element={<Layout dispatch={dispatch} />}
          />

          <Route
            path={RouteList.COURSEDASHBOARD}
            element={<CoursesLayout dispatch={dispatch} />}
          />
          <Route
            path={`${RouteList.CRMDASHBOARD}`}
            element={<CompaniessLayout dispatch={dispatch} />}
          />
        </Route>
        <Route path={RouteList.NOT_FOUND} element={<PageNotFound />} />
        <Route
          path={RouteList.ROOT}
          element={<Navigate replace to={RouteList.LOGIN_PAGE} />}
        />
      </Switch>
    </Router>
  ) : (
    <Loader active inline="centered" className="loader" />
  );
};

export default App;
