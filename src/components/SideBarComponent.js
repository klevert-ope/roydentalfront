"use client"
import React from "react";
import { NavSidebar } from "@/components/NavSidebar";
import { useCookies } from "next-client-cookies";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar";

const SideBarComponent = ({ children }) => {
    const cookieStore = useCookies();
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
    return (
            <SidebarProvider>
             <NavSidebar defaultOpen={defaultOpen} />
            <SidebarInset className="overflow-auto">
                    <SidebarTrigger/>
                    {children}
            </SidebarInset>
            </SidebarProvider>
    );
};

export default React.memo(SideBarComponent);
