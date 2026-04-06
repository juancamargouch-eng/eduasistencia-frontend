import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon?: string;
    children: React.ReactNode;
    className?: string;
}

const Modal: React.FC<ModalProps> = ({ 
    isOpen, 
    onClose, 
    title, 
    icon, 
    children,
    className = ""
}) => {
    // Bloquear scroll del body al abrir el modal para UX móvil
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    {/* Backdrop: Fondo desenfocado y oscuro */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                    />

                    {/* Contenedor del Modal: Estilo Glassmorphism Premium */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        className={`glass w-full max-w-lg rounded-[2.5rem] overflow-hidden relative z-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] border border-white/20 dark:border-slate-700/50 ${className}`}
                    >
                        {/* Cabecera del Modal */}
                        <div className="p-8 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-4">
                                {icon && (
                                    <div className="w-12 h-12 rounded-[1.25rem] bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                                        <span className="material-icons-outlined text-2xl">{icon}</span>
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">{title}</h2>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Formulario Institucional</p>
                                </div>
                            </div>
                            <button 
                                onClick={onClose}
                                className="w-10 h-10 rounded-full hover:bg-rose-500/10 hover:text-rose-500 flex items-center justify-center transition-all text-slate-400 active:scale-90"
                            >
                                <span className="material-icons-outlined">close</span>
                            </button>
                        </div>

                        {/* Cuerpo del Modal */}
                        <div className="p-8 md:p-10">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default Modal;
