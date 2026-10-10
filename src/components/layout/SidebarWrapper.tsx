// src/components/layout/SidebarWrapper.tsx
"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

// We use a context so Sidebar can communicate collapsed state to SidebarWrapper
import { createContext, useContext } from "react";

export const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}>({ collapsed: false, setCollapsed: () => {} });

export function useSidebar() {
  return useContext(SidebarContext);
}

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {/* Sidebar — fixed, full height */}
      <Sidebar />

      {/* Main content — offset by sidebar width, scrollable */}
      <div className={cn(
        "min-h-screen transition-all duration-300",
        // Desktop: offset by sidebar width
        collapsed ? "lg:pl-[68px]" : "lg:pl-64",
        // Mobile: no offset (sidebar is a drawer overlay)
        "pl-0"
      )}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
}