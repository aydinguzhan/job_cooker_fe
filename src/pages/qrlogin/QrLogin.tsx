import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function QrLogin() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const [message, setMessage] = useState("Kontrol ediliyor...");

  useEffect(() => {
    const checkAndApprove = async () => {
      if (!code) {
        setMessage("Geçersiz QR Kod!");
        return;
      }

      // 1. Telefondaki Token'ı kontrol et
      const token = localStorage.getItem("access_token");

      // 2. KANKA BURASI KRİTİK: Eğer telefonda token yoksa kullanıcısı giriş yapmamıştır!
      if (!token) {
        setMessage("Lütfen önce mobil cihazınızdan giriş yapın...");

        // Kullanıcıyı QR kodunu unutmadan Login sayfasına yönlendiriyoruz
        setTimeout(() => {
          // Login olduktan sonra tekrar buraya döneebilmek için 'redirect' parametresi ekliyoruz
          navigate(`/login?redirect=/qr-login?code=${code}`);
        }, 1500);
        return;
      }

      // 3. Eğer token varsa masaüstünü onaylayabiliriz
      try {
        setMessage("Masaüstü girişi onaylanıyor...");

        await axios.post(
          "http://192.168.1.9:8080/auth/qr-approve",
          { code },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setMessage("Giriş Onaylandı! Masaüstü ekranınız açıldı.");
      } catch {
        setMessage("Onay başarısız oldu veya QR kodun süresi doldu.");
      }
    };

    checkAndApprove();
  }, [code, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center font-medium text-gray-700 bg-white p-6 rounded-xl shadow">
        {message}
      </div>
    </div>
  );
}
