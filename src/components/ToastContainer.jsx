// src/components/ToastContainer.jsx
import { removeToast } from '@/store/slices/tostSlice';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

function ToastItem({ toast }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, dispatch]);

  const variants = {
    success: 'bg-green-600 border-green-700 text-white',
    error: 'bg-red-600 border-red-700 text-white',
    warning: 'bg-amber-600 border-amber-700 text-white',
    info: 'bg-blue-600 border-blue-700 text-white',
    default: 'bg-gray-800 border-gray-700 text-white',
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
    default: '!',
  };

  const variant = toast.variant || 'default';

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl
        animate-in fade-in slide-in-from-top-5 zoom-in-95
        duration-300 pointer-events-auto
        ${variants[variant]}
      `}
      role="alert"
    >
      <div className="text-xl font-bold min-w-[1.5rem] text-center">
        {icons[variant]}
      </div>

      <div className="flex-1 text-sm font-medium pr-2">
        {toast.message}
      </div>

      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className="text-white/80 hover:text-white rounded-full p-1 transition-colors"
        aria-label="Close"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const toasts = useSelector((state) => state.toast.toasts);

  return (
    <div className="fixed top-6 right-6 z-[1000] flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}