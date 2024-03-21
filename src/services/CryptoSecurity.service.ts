
import * as cryptoJS from 'crypto-js';

import atob from 'atob';
import btoa from 'btoa';
let SECRET_KEY = '';

export const encryptText = (message: string): string => {
    return cryptoJS.AES.encrypt(message, SECRET_KEY).toString();
}
export const decryptText = (message: string): string => {
    const bytes = cryptoJS.AES.decrypt(message, SECRET_KEY);
    return bytes.toString(cryptoJS.enc.Utf8);
}

const encrypAtob = (message: string): string => {
    return atob(atob(message));
}

const decryptBtoa = (message: string): string => {
    return btoa(btoa(message));
}
const setSeckey = (key: string) =>{
    SECRET_KEY = key
}


const CryptoJSService = {
    encryptText,
    decryptText,
    encrypAtob,
    decryptBtoa,
    setSeckey
};

export default CryptoJSService