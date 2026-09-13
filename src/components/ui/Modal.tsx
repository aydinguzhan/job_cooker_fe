import React, { useEffect } from "react";

interface ModalProps {
  isVisible: boolean;
  handleClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isVisible,
  handleClose,
  title,
  children,
}) => {
  // ESC tuşuna basıldığında kapatma ve arka plan scroll engelleme
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

    if (isVisible) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, handleClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* BackDrop (Tema Uyumlu Arka Plan Karartma) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-fade-in "
        onClick={handleClose}
      />

      {/* Modal Penceresi (CSS Değişkenlerinize Ve Temanıza Tam Uyumlu) */}
      <div className="relative w-full max-w-2xl rounded-2xl bg-surface-elevated border border-app shadow-surface transition-all animate-auth-fade-up z-10 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header / Başlık */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-app bg-surface-muted/50">
          <h3 className="text-lg font-semibold text-app">{title || "Warn"}</h3>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-soft hover:text-app hover:bg-surface-strong transition-colors cursor-pointer"
          >
            {/* Kapat (X) İkonu */}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* İçerik Alanı */}
        <div className="p-6 overflow-y-auto text-muted space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
