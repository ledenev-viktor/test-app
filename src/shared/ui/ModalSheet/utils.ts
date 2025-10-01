import type { SetStateAction } from "react";
export const setRef = (
  node: SetStateAction<HTMLDivElement | null>,
  setElement: (node: SetStateAction<HTMLDivElement | null>) => void
): void => {
  setElement?.(node);
};
