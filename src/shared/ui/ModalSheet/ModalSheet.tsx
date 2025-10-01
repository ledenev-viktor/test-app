import { CSSTransition } from "react-transition-group";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { use100vh } from "react-div-100vh";
import cn from "classnames";
import { useSwipeableModal } from "../../hooks/useSwipeableModal";
import { ScrollbarCustom } from "../ScrollbarCustom";
import { Portal } from "../Portal";
import type { IClassNames } from "./types";
import { setRef } from "./utils";
import s from "./ModalSheet.module.css";

export interface IModalSheetProps {
  id: string;
  isOpened: boolean;
  onClose: () => void;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  zIndex?: number;
  maxHeight?: number | string;
  closeFactor?: number;
  classnames?: IClassNames;
  timeout?: number;
  portalPrefix?: string;
}

/**
 * @deprecated
 * use Dialog instead
 */
export const ModalSheet = ({
  id,
  isOpened,
  onClose,
  children,
  header,
  footer,
  zIndex,
  maxHeight,
  closeFactor,
  timeout = 500,
  classnames,
  portalPrefix = "modal",
}: IModalSheetProps) => {
  const [scrollableElement, setScrollableElement] =
    useState<HTMLDivElement | null>(null);
  const [wrapperElement, setWrapperElement] = useState<HTMLDivElement | null>(
    null
  );

  const swipeElementRef = useRef(null);
  const [isHolding, setIsHolding] = useState(false);

  const handleTouchStart = () => {
    setIsHolding(true);
  };
  const handleTouchEnd = () => {
    setIsHolding(false);
  };
  const handleTouchMove = () => {
    setIsHolding(true);
  };

  const {
    isClosing,
    handleAnimationEnd,
    resetPosition,
    translateY,
    isSwiping,
    handlers,
    triggerClose,
  } = useSwipeableModal({
    isOpened,
    onClose,
    scrollableElement,
    wrapperElement,
    closeFactor,
    swipeElementRef,
    isHolding,
  });

  // Навесим класс modal-open (на тег body) для ограничения прокрутки основной страницы
  useEffect(() => {
    const body = document.querySelector("body");
    const html = document.querySelector("html");

    if (body && html) {
      if (isOpened) {
        body.classList.add(s.sheetOpen);
        body.classList.add(`id_${id}`);
        html.style.overflowY = "hidden";
      } else {
        if (body.classList.contains(`id_${id}`)) {
          body.classList.remove(s.sheetOpen);
          body.classList.remove(`id_${id}`);

          html.style.overflowY = "auto";
        }
      }
    }

    return () => {
      if (html && body && body.classList.contains(`id_${id}`)) {
        body.classList.remove("modal-open");
        html.style.overflowY = "auto";
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpened]);

  const window100vh = use100vh() || 0;

  return (
    <Portal data-name="ModalSheet" prefix={portalPrefix} zIndex={zIndex}>
      <CSSTransition
        in={isOpened && !isClosing}
        onExited={() => {
          handleAnimationEnd();
          resetPosition();
        }}
        timeout={timeout}
        unmountOnExit
      >
        <div
          className={cn(s.sheetOverlay)}
          onClick={() => {
            triggerClose?.();
          }}
          role="button"
        >
          <div
            className={cn(s.sheetWrapper)}
            id={id}
            onClick={(event) => event.stopPropagation()}
            role="presentation"
            style={{
              transform: wrapperElement?.offsetHeight
                ? `translateY(${translateY}px)`
                : "translateY(100%)",
              transition: isSwiping ? "none" : `transform ${timeout}ms ease`,
            }}
            {...handlers}
          >
            <div
              className={cn(s.sheetWrapperContent, classnames?.wrapper)}
              ref={(node) => setRef(node, setWrapperElement)}
              style={{
                maxHeight: maxHeight || window100vh,
              }}
            >
              <div
                className={cn(classnames?.swipeHead, {
                  [s.minSwipeable]: !header,
                })}
                ref={swipeElementRef}
              >
                {header}
              </div>
              <ScrollbarCustom
                className={cn(classnames?.scrollbar)}
                fullWidth={true}
                ref={(node) => setRef(node, setScrollableElement)}
              >
                <div
                  className={cn(classnames?.body)}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}
                  onTouchStart={handleTouchStart}
                >
                  {children}
                </div>
              </ScrollbarCustom>
              {footer}
            </div>
          </div>
        </div>
      </CSSTransition>
    </Portal>
  );
};
