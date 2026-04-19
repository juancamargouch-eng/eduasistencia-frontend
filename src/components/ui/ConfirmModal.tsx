import React from 'react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'info' | 'warning';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    type = 'info'
}) => {
    const getColor = () => {
        switch (type) {
            case 'danger': return 'bg-red-500';
            case 'warning': return 'bg-amber-500';
            default: return 'bg-primary';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'danger': return 'delete_forever';
            case 'warning': return 'warning';
            default: return 'help_outline';
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="flex flex-col items-center text-center p-6 sm:p-10">
                <div className={`${getColor()} w-20 h-20 rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-2xl animate-bounce-soft`}>
                    <span className="material-icons text-4xl">{getIcon()}</span>
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                    {title}
                </h3>
                
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-10 leading-relaxed max-w-xs mx-auto">
                    {description}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <Button 
                        variant="secondary" 
                        fullWidth 
                        onClick={onClose}
                        className="rounded-2xl py-4 font-black uppercase tracking-widest text-[10px]"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        variant={type === 'danger' ? 'red' : 'primary'}
                        fullWidth
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="rounded-2xl py-4 font-black uppercase tracking-widest text-[10px] shadow-xl"
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
