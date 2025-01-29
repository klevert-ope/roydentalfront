import {NavSidebar} from "@/components/NavSidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";

const SideBarComponent = ({ children }) => {
  return (
    <SidebarProvider>
        <NavSidebar/>
      <SidebarInset className="overflow-auto">
        <SidebarTrigger />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default React.memo(SideBarComponent);
