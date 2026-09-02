import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { X } from "lucide-react";
import LoginQr from "../Qr/LoginQr";
import { getLoginQr } from "../../services/auth.service";
import CodeBox from "../Qr/CodeBox";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOpenQr, setIsOpenQr] = useState(false);
  const [loginCode, setLoginCode] = useState(null);
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };
  const toggleQr = () => {
    setIsOpenQr((prev) => !prev);
  };

  const qrUrl = "";

  useEffect(() => {
    const getloginCode = async () => {
      const code = await getLoginQr();
      if (code) setLoginCode(code);
    };
    if (isOpenQr) {
      getloginCode();
    }
  }, [isOpenQr]);

  return (
    <div className="flex h-screen overflow-hidden bg-app text-app">
      <Sidebar isOpen={isSidebarOpen} />
      {isOpenQr && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className=" bg-white/50 fixed left-1/2 top-1/2 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-xl">
            <div className="p-4 flex justify-end">
              <X
                className="bg-red  text-red-600 hover:cursor-pointer hover:text-red-400"
                width={20}
                height={20}
                onClick={() => {
                  toggleQr();
                }}
              />
            </div>
            <div className=" p-6 flex justify-center w-100 h-100  gap-4">
              <div className="flex center justify-center items-center ">
                <div className="rounded-xl bg-white p-6 flex-1">
                  {loginCode ? (
                    <CodeBox code={loginCode} />
                  ) : (
                    <LoginQr url={qrUrl} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          toggleQr={toggleQr}
        />

        <main className="min-h-0 flex-1 overflow-y-auto bg-app p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
