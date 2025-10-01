import type { MacScrollbarProps } from "mac-scrollbar";
import { MacScrollbar } from "mac-scrollbar";
import cn from "classnames";
import "./ScrollbarCustom.css";
import { forwardRef } from "react";
import "mac-scrollbar/dist/mac-scrollbar.css";

export type TScrollbarCustomProps = MacScrollbarProps & {
  fullWidth?: boolean;
};

/**
 * @deprecated Используйте Scrollbar
 */
export const ScrollbarCustom = forwardRef<
  HTMLDivElement,
  TScrollbarCustomProps
>((props: TScrollbarCustomProps, ref) => {
  return (
    <MacScrollbar
      className={cn(
        "scrollbar",
        props.fullWidth && "scrollbar-full-width",
        props.className
      )}
      ref={ref}
      style={props.style}
      trackGap={props.trackGap || [0, 0, 12, 12]}
    >
      {props.children}
    </MacScrollbar>
  );
});
