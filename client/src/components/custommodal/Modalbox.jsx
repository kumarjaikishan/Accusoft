import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import './modalbox.css';

const Modalbox = ({ open, onClose, children, shadow = true }) => {
  useEffect(() => {
    if (open) {
      const getScrollbarWidth = () => {
        return window.innerWidth - document.documentElement.clientWidth;
      };

      const scrollbarWidth = getScrollbarWidth();

      // Set body styles to compensate for scrollbar disappearance
      document.body.style.overflowY = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        setTimeout(() => {
          document.body.style.overflowY = 'scroll';
          document.body.style.paddingRight = '0px'; // Reset padding
        }, 100);
      };
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      onClick={onClose}
      className="
        fixed inset-0 z-1000 
        bg-black/50 backdrop-blur-[5px]
        flex items-center justify-center animate-in fade-in duration-200
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-surface rounded-[15px] modalboxe transition-all animate-in zoom-in-95 fade-in duration-200"
        style={shadow ? { boxShadow: "0 10px 20px rgba(0,0,0,0.4)" } : undefined}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modalbox;
