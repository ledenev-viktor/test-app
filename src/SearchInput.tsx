import { useAutoFocus } from "./shared/hooks/useAutoFocus";
import s from "./App.module.css";

export const SearchInput = () => {
  const inputRef = useAutoFocus({ delay: 200 });

  return (
    <input placeholder="Тестовый инпут" className={s.input} ref={inputRef} />
  );
};
