import React from 'react';
import { X } from 'lucide-react';
import { useSelector } from 'react-redux';
import Modalbox from './Modalbox';

/**
 * Standard ModalCard Wrapper Component
 * Uses the user-chosen theme main color (`var(--maincolor)` or Redux `state.theme.mainColor`)
 * for header banners across all application modals.
 */
const ModalCard = ({
    open,
    onClose,
    title,
    children,
    width = '500px',
    maxWidth = '96vw',
    className = ''
}) => {
    const mainColor = useSelector((state) => state.theme?.mainColor);

    return (
        <Modalbox open={open} onClose={onClose}>
            <div
                className={`h-max rounded-[20px] flex flex-col items-center shadow-2xl relative ${className}`}
                style={{
                    width: width,
                    maxWidth: maxWidth,
                    backgroundColor: mainColor || 'var(--maincolor)',
                    borderRadius: '20px'
                }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    type="button"
                    className="absolute top-2 right-3 text-white/80 hover:text-white transition-colors cursor-pointer p-1 z-10 drop-shadow-sm"
                    title="Close"
                >
                    <X size={24} />
                </button>

                {/* Header Title */}
                <h1 className="w-full h-[52px] leading-[52px] text-white tracking-[1.5px] font-bold text-xl sm:text-2xl text-center px-10 truncate rounded-t-[20px]">
                    {title}
                </h1>

                {/* Surface Body Container */}
                <div className="w-full bg-surface rounded-t-[30px] rounded-b-[20px] border-t border-white/20 relative">
                    {children}
                </div>
            </div>
        </Modalbox>
    );
};

export default ModalCard;
