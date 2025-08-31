/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUser, logout as logoutAction } from "@/slices/authSlice";
import { useGetUserDetailsQuery } from "@/slices/userApiSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  IconUserCircle,
  IconNotification,
  IconLogout,
  IconDotsVertical,
} from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";

export function NavUser() {
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  // Fetch latest user data from backend and update Redux
  const { data } = useGetUserDetailsQuery(userInfo?.id, {
    skip: !userInfo?.id,
  });

  useEffect(() => {
    if (data) {
      dispatch(updateUser(data));
    }
  }, [data, dispatch]);

  const handleLogout = () => {
    dispatch(logoutAction());
  };

  const initials = `${userInfo?.firstName?.[0] || ""}${
    userInfo?.lastName?.[0] || ""
  }`.toUpperCase();

  // Active check for notifications
  const isNotificationsActive = location.pathname.startsWith(
    "/admin/notifications"
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                {userInfo?.profileImage ? (
                  <AvatarImage
                    src={userInfo.profileImage}
                    alt={userInfo.firstName}
                  />
                ) : (
                  <AvatarFallback>{initials}</AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{`${userInfo?.firstName} ${userInfo?.lastName}`}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {userInfo?.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {userInfo?.profileImage ? (
                    <AvatarImage
                      src={userInfo.profileImage}
                      alt={userInfo.firstName}
                    />
                  ) : (
                    <AvatarFallback>{initials}</AvatarFallback>
                  )}
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{`${userInfo?.firstName} ${userInfo?.lastName}`}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {userInfo?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/admin/profile">
                <IconUserCircle /> Account
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                to="/admin/notifications"
                className={`flex items-center gap-2 w-full ${
                  isNotificationsActive
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/30"
                }`}
              >
                <IconNotification />
                <span>Notifications</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
