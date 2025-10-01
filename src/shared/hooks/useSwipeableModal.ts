import type { RefObject } from "react";
import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import type { SwipeEventData } from "react-swipeable/es/types";

export const useSwipeableModal = ({
  isOpened,
  onClose,
  closeFactor = 0.5,
  scrollableElement,
  wrapperElement,
  swipeElementRef,
  isHolding,
}: {
  isOpened: boolean;
  onClose: () => void;
  closeFactor?: number;
  enableSwipe?: boolean;
  scrollableElement: HTMLDivElement | null;
  wrapperElement: HTMLDivElement | null;
  swipeElementRef?: RefObject<HTMLDivElement | null>;
  isHolding: boolean;
}) => {
  const defaultTranslateY = () =>
    wrapperElement?.offsetHeight || window.innerHeight;
  const [translateY, setTranslateY] = useState(defaultTranslateY);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [threshold, setThreshold] = useState(0);

  useEffect(() => {
    if (wrapperElement && wrapperElement.clientHeight > 0) {
      const factor = closeFactor <= 1 ? closeFactor : 0.5;
      setThreshold(wrapperElement.clientHeight * factor);
    }
  }, [wrapperElement, closeFactor]);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      const target = event.target as HTMLDivElement;
      const value = target.scrollTop;
      setScrollPos(value);
    };

    if (scrollableElement) {
      scrollableElement.addEventListener("scroll", handleScroll);

      return () => {
        scrollableElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [scrollableElement]);

  const handlers = useSwipeable({
    onSwiping: (swipeParams: SwipeEventData) => {
      const target = swipeParams.event.target as Element;

      if (
        swipeElementRef?.current &&
        !swipeElementRef?.current.contains(target)
      ) {
        const shouldPreventSwipe = shouldSkipSwiping();

        if (shouldPreventSwipe) return;
      }

      if (swipeParams.dir === "Down" && !isClosing) {
        setTranslateY(swipeParams.deltaY);
        setIsSwiping(true);
      }
    },
    onSwipedDown: () => {
      if (translateY > threshold) {
        triggerClose();
      } else {
        resetPosition();
      }
    },
    onSwiped: () => {
      resetPosition();
    },
    preventScrollOnSwipe: false,
    trackMouse: true,
  });

  const shouldSkipSwiping = () => {
    if (scrollPos === -1) {
      return false;
    }

    return true;
  };

  const resetPosition = () => {
    setTranslateY(0);
    setIsSwiping(false);
  };

  const triggerClose = () => {
    setIsClosing(true);
    setTranslateY(defaultTranslateY);
  };

  const handleAnimationEnd = () => {
    if (isClosing) {
      setIsClosing(false);
      onClose();
    }
  };

  useEffect(() => {
    if (!isHolding && scrollPos === 0) {
      setScrollPos(-1);
    }
  }, [isHolding, scrollPos]);

  useEffect(() => {
    if (isOpened && !isClosing) {
      setTranslateY(0);
    }
  }, [isOpened, isClosing]);

  useEffect(() => {
    if (!isOpened) {
      setTranslateY(defaultTranslateY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpened, translateY]);

  return {
    isClosing,
    handleAnimationEnd,
    resetPosition,
    translateY,
    isSwiping,
    handlers,
    triggerClose,
  };
};
