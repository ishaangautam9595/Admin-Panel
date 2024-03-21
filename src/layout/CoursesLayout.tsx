import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseSidebar from "../elements/CourseSidebar";
import CourseContent from "../pages/CourseContent";
import instance from "../services/api/index.service";
import {
  getAdminProfile,
  logOutAndNavigate,
  setAdminToken,
} from "../services/user.service";
import AppRouteList from "../constants/ApiRoute.constant";
import { APP_SEC } from "../constants/enum";
import CryptoJSService from "../services/CryptoSecurity.service";
import { toast } from "react-toastify";
import { SERVER_ERROR } from "../constants/Constants";
import Storage from "../services/localStorage";
import { onCallIsAuth } from "../_redux/slices/isAuth";
import Footer from "../elements/Footer";
const CoursesLayout = (props: any) => {
  const navigate = useNavigate();
  const { dispatch } = props;
  props = { ...props, navigate };
  const [userInformation, setUserInformation] = useState<any>();

  useEffect(() => {
    let userInfo = getAdminProfile();
    setUserInformation(userInfo);
    setAdminToken();
    checkUserExist(userInfo);
  }, []);

  const checkUserExist = async (userInfo: { _id: string }) => {
    dispatch(onCallIsAuth({ value: true }));
    try {
      const { data, status } = await instance.get<APP_SEC | any>(
        `${AppRouteList.ADMIN}/${userInfo._id}`
      );
      if (status === 200) {
        Storage.setUserData(
          CryptoJSService.encryptText(JSON.stringify(data.data))
        );
        dispatch(onCallIsAuth({ value: true }));
      }
    } catch (err: any) {
      const { response } = err;
      if (err.response && err.response.status == 401) {
        logOutAndNavigate(props);
      }
      response && toast.error(response.data.message || SERVER_ERROR);
    }
  };
  return (
    <>
      <CourseSidebar />
      <CourseContent />
      <div style={{ position: 'fixed', bottom: '2px', width: '100%', margin: 0 }}><Footer /></div>
    </>
  );
};

export default CoursesLayout;
