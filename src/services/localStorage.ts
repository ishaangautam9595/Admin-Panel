
const Storage = {
    setToken: (data: any): void => localStorage.setItem("token", data),
    getToken: (): string | null => getItem("token"),
    setUserData: (data: any): void => localStorage.setItem("userData", data),
    getUserData: (): string | null => getItem("userData"),
    removeData: (key: string): void => localStorage.removeItem(key),
    clearAllData: (): void =>  localStorage.clear()
};

const getItem = (key: string): string | null => {
    return localStorage.getItem(key) || null
}

export default Storage;