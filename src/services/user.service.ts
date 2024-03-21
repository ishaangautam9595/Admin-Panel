import RouteList from "../constants/Routes.constant";
import { onCallIsAuth } from "../_redux/slices/isAuth";
import CryptoJSService from "./CryptoSecurity.service";
import Storage from "./localStorage";
let TOKEN: any = null;
export const getAdminProfile = () => {
    try {
        let userInfo: string = Storage.getUserData() || '';
        return userInfo.length ? JSON.parse(CryptoJSService.decryptText(userInfo)) : null;
    } catch (error) {
        Storage.clearAllData();
        location.replace('/login');
    }
}

export const setAdminToken = () => {
    let token: string = Storage.getToken() || '';
    TOKEN = CryptoJSService.decryptText(token);
}
export const getAdminToken = () => {
    return TOKEN;
}

export const logOutAndNavigate = (props: any) => {
    const { dispatch, navigate } = props;
    localStorage.clear()
    Storage.clearAllData();
    dispatch(onCallIsAuth({ value: false }));
    navigate(RouteList.LOGIN_PAGE);
    return;
}
