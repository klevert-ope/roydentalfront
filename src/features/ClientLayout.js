"use client";

import React from "react";
import { useAuth } from "@/utility/AuthProvider";
import { NavSidebar } from "@/components/NavSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "react-hot-toast";

const ClientLayout = ({ children }) => {
    const { user, isLoading: isAuthLoading, accessToken, refreshToken } = useAuth();

    // Helper function to check if tokens are valid
    const areTokensValid = () => {
        return !!accessToken && !!refreshToken;
    };

    return (
        <>
            {!isAuthLoading && user && areTokensValid() && <NavSidebar />}
            <SidebarInset className="overflow-auto">
                <main>
                    {!isAuthLoading && user && areTokensValid() && <SidebarTrigger />}
                    {children}
                </main>
                <Toaster />
            </SidebarInset>
        </>
    );
};

export default React.memo(ClientLayout);
