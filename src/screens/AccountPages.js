import React from 'react';

import LoginPages from './LoginPages';
import AccountScreen from './AccountScreen'


import { selectHasLogin } from "../redux/slice";
import { useSelector } from "react-redux";


const Account = () => {
    const hasLogin = useSelector(selectHasLogin);

    return (
        <>
            {
                hasLogin ? <AccountScreen /> :
                    <LoginPages />
            }
        </>
    )

}

export default Account;