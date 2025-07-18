import React, { useEffect } from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-background rounded-2xl shadow-2xl flex flex-col w-[95vw] h-[95vh] max-w-[95vw] max-h-[95vh] border border-border animate-in fade-in zoom-in-95"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground z-10"
        >
          ×
        </button>
        
        <div className="flex-1 flex flex-col min-h-0 overflow-auto">
          {children}
        </div>
      </div>
    </div>,
    typeof window !== "undefined" ? document.body : (null as any)
  );
};

export default Modal; 