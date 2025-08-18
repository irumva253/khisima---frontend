/* eslint-disable no-unused-vars */
"use client"

import { NavLink, useLocation, Link } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
items,
  ...props
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname.includes(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <NavLink to={`/admin/${item.url}`} className="w-full">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`w-full ${isActive ? "bg-primary/10 text-primary" : ""}`}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </NavLink>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
