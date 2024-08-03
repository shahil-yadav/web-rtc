import React, { createContext, useContext, useState } from 'react';

interface IToast {
  err: string;
  id: number;
}

interface ToastContextProps {
  open: (err: string) => void;
}

const ToastContext = createContext<ToastContextProps>({
  open: () => {},
});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<IToast[]>([]);

  function open(err: string) {
    setToasts((prev) => [...prev, { err, id: Date.now() }]);
  }

  function close(id: number) {
    setToasts((prev) => [...prev.filter((toast) => toast.id !== id)]);
  }

  return (
    <ToastContext.Provider value={{ open }}>
      {children}
      <Toast toasts={toasts} close={close} />
    </ToastContext.Provider>
  );
}

function Toast(props: { toasts: IToast[]; close: (id: number) => void }) {
  return props.toasts.map((toast) => (
    <div key={toast.id} className="toast whitespace-normal toast-top">
      <div className="alert alert-info text-white font-semibold">
        <span>{toast.err}</span>
        <button onClick={() => props.close(toast.id)}>❌</button>
      </div>
    </div>
  ));
}

export const useToast = () => useContext(ToastContext);
