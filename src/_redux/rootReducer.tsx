import isAuthreducer from "./slices/isAuth";
import isAdminInfoReducer from "./slices/isAdminInfo";


const rootReducer = {
    isAuth: isAuthreducer,
    isUserInfo: isAdminInfoReducer,

}

export default rootReducer;