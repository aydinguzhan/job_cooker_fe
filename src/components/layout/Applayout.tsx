import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { X } from "lucide-react";
import LoginQr from "../Qr/LoginQr";
import { getLoginQr, checkQrStatus } from "../../services/auth.service";
import CodeBox from "../Qr/CodeBox";

type AppLayoutProps = {
  children: ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOpenQr, setIsOpenQr] = useState(false);
  const [loginCode, setLoginCode] = useState<string | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleQr = () => {
    setIsOpenQr((prev) => {
      if (prev) setLoginCode(null);
      return !prev;
    });
  };

  // 🛑 HTTP Protokolü ve Frontend Port Numarası eklendi
  const loginUrlOrigin = "http://192.168.1.9:5173"; // Frontend portunuz kaç ise (3000, 5173 vb.) onu yazın
  const qrUrl = loginCode ? `${loginUrlOrigin}/qr-login?code=${loginCode}` : "";
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;
    let isMounted = true; // Component unmount kontrolü

    const fetchCodeAndPoll = async () => {
      try {
        // 1. Kod oluştur
        const code = await getLoginQr();
        if (!code || !isMounted) return;

        setLoginCode(code);

        // 2. Polling Başlat
        intervalId = setInterval(async () => {
          try {
            const response = await checkQrStatus(code);
            const status = response?.data?.status || response?.status;

            if (status === "SUCCESS") {
              clearInterval(intervalId);
              // setIsOpenQr(false);
              // setLoginCode(null);
              console.log(response);
            } else if (status === "EXPIRED") {
              clearInterval(intervalId);
              setLoginCode(null);
              alert("QR kodun süresi doldu. Lütfen tekrar açın.");
            }
          } catch (err) {
            console.error("QR status check error:", err);
          }
        }, 2000);
      } catch (error) {
        console.error("QR code alınamadı:", error);
      }
    };

    if (isOpenQr) {
      fetchCodeAndPoll();
    }

    // Cleanup: Modal kapandığında veya unmount olduğunda interval'i KESİNLİKLE durdurur
    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOpenQr]); // Bağımlılıklara setLoginCode veya fonksiyon koymayın!

  return (
    <div className="flex h-screen overflow-hidden bg-app text-app">
      <Sidebar isOpen={isSidebarOpen} />
      {isOpenQr && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <div className="bg-white fixed left-1/2 top-1/2 z-[100] -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg">
            <div className="p-4 flex justify-end">
              <X
                className="text-red-600 hover:cursor-pointer hover:text-red-400"
                width={20}
                height={20}
                onClick={toggleQr}
              />
            </div>
            <div className="p-6 flex justify-center w-100 h-100 gap-4">
              <div className="flex center justify-center items-center">
                <div className="rounded-xl bg-white p-6 flex-1">
                  {loginCode ? (
                    <div className="flex flex-col items-center gap-4">
                      <LoginQr url={qrUrl} />
                      <CodeBox code={loginCode} />
                    </div>
                  ) : (
                    <p className="text-gray-500">Kod yükleniyor...</p>
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

        <main className="relative z-0 min-h-0 flex-1 overflow-y-auto bg-app p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
