import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AppRouteList from '../constants/ApiRoute.constant';
import { LOG_OUT_SUCCESS, SERVER_ERROR } from '../constants/Constants';
import { APP_SEC } from '../constants/enum';
import Footer from '../elements/Footer';
import Sidebars from '../elements/Sidebar';
import Content from '../pages/Content';
import instance from '../services/api/index.service';
import CryptoJSService from '../services/CryptoSecurity.service';
import Storage from '../services/localStorage';
import { getAdminProfile, logOutAndNavigate, setAdminToken } from '../services/user.service'
import { onCallIsAuth } from '../_redux/slices/isAuth';
const Layout = (props: any) => {
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
        dispatch(onCallIsAuth({ value: true }))
        try {
            const { data, status } = await instance.get<APP_SEC | any>(`${AppRouteList.ADMIN}/${userInfo._id}`);
            if (status === 200) {
                Storage.setUserData(CryptoJSService.encryptText(JSON.stringify(data.data)))
                dispatch(onCallIsAuth({ value: true }))
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
            <Sidebars />
            <Content />
            <div style={{ position: 'fixed', bottom: '2px', width: '100%', margin: 0 }}><Footer /></div>
        </>
    )
}

export default Layout