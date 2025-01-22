"use client";

import React, { useMemo } from "react";
import { useAuth } from "@/utility/AuthProvider";
import { NavSidebar } from "@/components/NavSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "react-hot-toast";

const ClientLayout = ({ children }) => {
    const { user, isLoading: isAuthLoading, accessToken, refreshToken } = useAuth();

    const isUserValid = useMemo(() => {
        return !isAuthLoading && user && accessToken && refreshToken;
    }, [isAuthLoading, user, accessToken, refreshToken]);

    return (
        <>
            {isUserValid && <NavSidebar />}
            <SidebarInset className="overflow-auto">
                <main>
                    {isUserValid && <SidebarTrigger />}
                    {children}
                </main>
                <Toaster />
            </SidebarInset>
        </>
    );
};

export default React.memo(ClientLayout);
