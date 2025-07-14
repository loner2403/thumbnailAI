import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close modal overlay"
      />
      {/* Modal content */}
      <div
        className="relative bg-background rounded-2xl shadow-2xl flex flex-col w-[95vw] h-[95vh] max-w-[95vw] max-h-[95vh] overflow-hidden border border-border animate-in fade-in zoom-in-95"
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.25)" }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center cursor-pointer rounded-full bg-muted/80 hover:bg-muted transition-colors shadow-sm"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex-1 flex flex-col overflow-auto">{children}</div>
      </div>
    </div>,
    typeof window !== "undefined" ? document.body : (null as any)
  );
};

export default Modal; 