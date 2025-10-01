import { useEffect, useRef } from "react";
import s from "./App.module.css";

export const SearchInput = () => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return (
    <input placeholder="Тестовый инпут" className={s.input} ref={inputRef} />
  );
};
