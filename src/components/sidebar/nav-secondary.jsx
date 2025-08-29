"use client"
import * as React from "react"
import { NavLink, useLocation } from "react-router-dom"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({ items, ...props }) {
  const location = useLocation();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname === item.url 
              || location.pathname.startsWith(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <NavLink to={item.url} className="w-full">
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
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
