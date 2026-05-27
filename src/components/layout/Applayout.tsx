import { useState } from "react";
import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-app text-app">
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="min-h-0 flex-1 overflow-y-auto bg-app p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
