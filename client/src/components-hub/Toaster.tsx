
import React from 'react';
import Toast from './Toast';
import { ToastMessage } from '@/types-hub';

interface ToasterProps {
    toasts: ToastMessage[];
    removeToast: (id: number) => void;
}

export const Toaster: React.FC<ToasterProps> = ({ toasts, removeToast }) => {
    return (
        <div className="fixed top-24 right-5 z-50 w-full max-w-sm space-y-3">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={removeToast} />
            ))}
        </div>
    );
};
