import React, { useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { ToastMessage, ToastType } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onClose: (id: number) => void;
}

const ICONS: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-6 h-6 text-green-500" />,
  error: <AlertTriangle className="w-6 h-6 text-red-500" />,
  info: <Info className="w-6 h-6 text-blue-500" />,
};

const TOAST_STYLES: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 5000); // Auto-close after 5 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [onClose, toast.id]);

  const Wrapper = toast.onClick ? 'button' : 'div';

  return (
    <Wrapper 
        onClick={toast.onClick}
        className={`w-full text-left rounded-lg shadow-lg animate-fade-in-up border ${TOAST_STYLES[toast.type]} ${toast.onClick ? 'cursor-pointer hover:shadow-xl' : ''}`}
        role={Wrapper === 'div' ? "alert" : undefined}
        aria-live={Wrapper === 'div' ? "assertive" : undefined}
    >
      <div className="p-4 flex items-start">
        <div className="flex-shrink-0">{ICONS[toast.type]}</div>
        <div className="ml-3 w-0 flex-1 pt-0.5">
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={(e) => {
                e.stopPropagation(); // prevent wrapper onClick if it exists
                onClose(toast.id);
            }}
            className="inline-flex rounded-md p-1.5 text-current/70 hover:bg-current/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-current/10 focus:ring-current/50"
            aria-label="Close notification"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default Toast;