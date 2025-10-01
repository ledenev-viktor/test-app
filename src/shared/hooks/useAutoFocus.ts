import { useRef, useEffect } from "react";

export const useAutoFocus = ({ delay = 0, enabled = true } = {}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!enabled || !inputRef.current) return;

    const focusElement = () => {
      if (inputRef.current) {
        inputRef.current.focus();
        console.log("delay", delay);
      }
    };

    if (delay > 0) {
      const timer = setTimeout(focusElement, delay);

      return () => clearTimeout(timer);
    } else {
      focusElement();
    }
  }, [delay, enabled]);

  return inputRef;
};
