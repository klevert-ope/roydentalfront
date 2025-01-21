"use client";

import React from "react";
import { useAuth } from "@/utility/AuthProvider";
import { NavSidebar } from "@/components/NavSidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "react-hot-toast";

const ClientLayout = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuth();

  return (
    <>
      {!isAuthLoading && user && <NavSidebar />}
      <SidebarInset className="overflow-auto">
        <main>
          {!isAuthLoading && user && <SidebarTrigger />}
          {children}
        </main>
        <Toaster />
      </SidebarInset>
    </>
  );
};

export default React.memo(ClientLayout);
