"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import UserProfile from "@/features/userProfile/UserProfile";
import Link from "next/link";
import { Hospital } from "lucide-react";

const links = [
  { href: "/", title: "Home", label: "Home" },
  { href: "/patients", title: "Patients", label: "Patients" },
  { href: "/doctors", title: "Doctors", label: "Doctors" },
  {
    href: "/insurancecompanies",
    title: "Insurance Companies",
    label: "Insurance Companies",
  },
  { href: "/billings", title: "Billings", label: "Billings" },
  { href: "/users", title: "Users", label: "Users" },
];

export function NavSidebar() {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-2xl">
            <Hospital />
            <span className={"ml-2"}>RGDC</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu
              className={"list-none prose-a:no-underline flex" +
                " flex-col justify-between min-h-[40svh]"}
            >
              <div>
                {links.map((link) => (
                  <SidebarMenuItem key={link.title}>
                    <SidebarMenuButton
                      asChild
                      className="mt-2 p-2 w-full"
                      tooltip={link.title}
                    >
                      <Link
                        href={link.href}
                        title={link.title}
                        className="text-nowrap text-xl w-full text-white"
                        onClick={() => setOpenMobile(false)}
                        prefetch={true}
                      >
                        {link.label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
            </SidebarMenu>
            <UserProfile />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
