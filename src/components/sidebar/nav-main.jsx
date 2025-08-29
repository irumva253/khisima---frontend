/* eslint-disable no-unused-vars */
"use client"

import { NavLink, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({ items, ...props }) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            // Check if current path matches the item's url
            const isActive = location.pathname.startsWith(`/admin/${item.url}`);

            return (
              <SidebarMenuItem key={item.title}>
                <NavLink to={`/admin/${item.url}`} className="w-full">
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`w-full transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/30"
                    }`}
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
