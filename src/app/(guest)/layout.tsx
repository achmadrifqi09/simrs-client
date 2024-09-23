"use client"
import React, {ReactNode} from "react";
import {AppProgressBar as ProgressBar} from "next-nprogress-bar";

const AuthLayout = ({children}: { children: ReactNode }) => {
    return (
        <>
            <ProgressBar
                height="5px"
                color="#F1A7AC"
                options={{ showSpinner: false }}
                shallowRouting
            />
            {children}
        </>);
}

export default AuthLayout;