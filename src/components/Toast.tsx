import { useEffect } from "react";

export type ToastMessage = {
  message: string;
  type: "success" | "error";
};

interface Props {
  message: ToastMessage | null;
  onClear: () => void;
}

function Toast({ message, onClear }: Props) {
  useEffect(() => {
    if (!message) return;
    const timeout = setTimeout(onClear, 2800);
    return () => clearTimeout(timeout);
  }, [message, onClear]);

  if (!message) return null;

  return <div className={`toast toast-${message.type}`}>{message.message}</div>;
}

export default Toast;