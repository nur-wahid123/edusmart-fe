"use client";

import * as React from "react";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { AppContext } from "@/user-components/contexts/app.context";

export function TeamSwitcher() {
  const { isLoading: loading, error } = React.useContext(AppContext);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="grid grid-cols-5 items-center gap-2 px-1 py-1.5 rounded-lg transition-colors data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <div className="flex col-span-1 aspect-square size-10 items-center justify-center rounded-lg bg-muted text-sidebar-primary-foreground border border-sidebar-border overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=256&h=256"
         
              alt="School Logo"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex col-span-4 flex-col min-w-0">
            <span className="truncate font-semibold text-sm">
              School Name
            </span>
          </div>
        </div>
  
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
