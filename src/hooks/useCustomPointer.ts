import { useLayoutEffect } from "preact/hooks";

function isMobileDevice(): boolean {
  // Basic check for mobile devices using user agent and touch support
  if (typeof navigator !== "undefined") {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    // Check for iOS, Android, or touch support
    return (
      /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(ua) ||
      ("ontouchstart" in window && !("onmousemove" in window))
    );
  }
  return false;
}


export function useCustomPointer() {
  useLayoutEffect(() => {
    const defaultSize = 20;
    const cursor = document.createElement("div");
    cursor.style.position = "fixed";
    cursor.style.pointerEvents = "none";
    cursor.style.zIndex = "9999";
    cursor.style.width = defaultSize + "px";
    cursor.style.height = defaultSize + "px";
    cursor.style.borderRadius = "10px";
    cursor.style.background = "#ffffff60";
    cursor.style.display = "none";
    cursor.style.mixBlendMode = "lighten";
    document.body.appendChild(cursor);

    // Helper to set transition only when needed
    let transitionTimeout: number | null = null;
    function enableTransition() {
      cursor.style.transition =
        "background 0.2s, transform 0.2s, width 0.2s, height 0.2s, left 0.2s, top 0.2s";
      if (transitionTimeout !== null) {
        clearTimeout(transitionTimeout);
      }
    }
    function disableTransition() {
        transitionTimeout = window.setTimeout(() => {
            cursor.style.transition = "";
            transitionTimeout = null;
          }, 200);
    }

    // Find the closest ancestor with class "pointer"
    function getPointerElement(target: EventTarget | null): HTMLElement | null {
      let el = target as HTMLElement | null;
      while (el && el !== document.body) {
        if (el.classList && el.classList.contains("pointer")) return el;
        el = el.parentElement;
      }
      return null;
    }

    let lastPointerElement: HTMLElement | null = null;

    // Mouse support
    function moveCursor(e: MouseEvent) {
      const pointerEl = getPointerElement(e.target);
      if (pointerEl) {
        enableTransition();
        // Get bounding rect of the pointer element
        const rect = pointerEl.getBoundingClientRect();
        cursor.style.left = `${rect.left}px`;
        cursor.style.top = `${rect.top}px`;
        cursor.style.width = `${rect.width}px`;
        cursor.style.height = `${rect.height}px`;
        // cursor.style.borderRadius = window.getComputedStyle(pointerEl).borderRadius || "8px";
        cursor.style.background = "#ffffff40";
        cursor.style.display = "block";
        cursor.style.transform = "scale(1)";
        lastPointerElement = pointerEl;
      } else {
        disableTransition();
        // Default cursor
        cursor.style.width = defaultSize + "px";
        cursor.style.height = defaultSize + "px";
        cursor.style.left = `${e.clientX - defaultSize / 2}px`;
        cursor.style.top = `${e.clientY - defaultSize / 2}px`;
        // cursor.style.borderRadius = "10px";
        cursor.style.background = "#ffffff60";
        cursor.style.display = "block";
        cursor.style.transform = "scale(1)";
        lastPointerElement = null;
      }
    }

    // Touch support
    function moveTouchCursor(e: TouchEvent) {
      if (e.touches.length > 0) {
        disableTransition();
        const touch = e.touches[0];
        cursor.style.width = defaultSize + "px";
        cursor.style.height = defaultSize + "px";
        cursor.style.left = `${touch.clientX - defaultSize / 2}px`;
        cursor.style.top = `${touch.clientY - defaultSize / 2}px`;
        // cursor.style.borderRadius = "10px";
        cursor.style.background = "#ffffff60";
        cursor.style.display = "block";
        cursor.style.transform = "scale(1)";
        lastPointerElement = null;
      }
    }

    // Hide cursor on touch end
    function hideTouchCursor() {
      cursor.style.display = "none";
      lastPointerElement = null;
    }

    // Ripple effect
    function showRipple(x: number, y: number) {
      const ripple = document.createElement("div");
      const rippleSize = 30;
      ripple.style.position = "fixed";
      ripple.style.left = `${x - rippleSize / 2}px`;
      ripple.style.top = `${y - rippleSize / 2}px`;
      ripple.style.width = `${rippleSize}px`;
      ripple.style.height = `${rippleSize}px`;
      ripple.style.borderRadius = "50%";
    //   ripple.style.background = "#ffffff20";
      ripple.style.boxShadow = "0 0 8px 2px #ffffff20";
      ripple.style.pointerEvents = "none";
      ripple.style.zIndex = "9999";
      ripple.style.transform = "scale(0.7)";
      ripple.style.opacity = "0.7";
      ripple.style.transition =
        "transform 0.5s cubic-bezier(.4,0,.2,1), opacity 0.5s cubic-bezier(.4,0,.2,1)";
      document.body.appendChild(ripple);

      // Force reflow for transition
      void ripple.offsetWidth;
      ripple.style.transform = "scale(2.7)";
      ripple.style.opacity = "0";

      setTimeout(() => {
        if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
      }, 500);
    }

    !isMobileDevice() && window.addEventListener("mousemove", moveCursor);
    !isMobileDevice() && window.addEventListener("mousedown", (e) =>
      showRipple(e.clientX, e.clientY)
    );
    window.addEventListener("touchmove", moveTouchCursor, { passive: true });
    window.addEventListener(
      "touchstart",
      (e) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          moveTouchCursor(e);
          showRipple(touch.clientX, touch.clientY);
        }
      },
      { passive: true }
    );
    window.addEventListener("touchend", hideTouchCursor, { passive: true });
    window.addEventListener("touchcancel", hideTouchCursor, { passive: true });

    // For pointer class hover/focus (keyboard navigation)
    // Use event delegation for efficiency
    function pointerOverHandler(e: Event) {
      const pointerEl = getPointerElement(e.target);
      if (pointerEl) {
        enableTransition();
        const rect = pointerEl.getBoundingClientRect();
        cursor.style.left = `${rect.left}px`;
        cursor.style.top = `${rect.top}px`;
        cursor.style.width = `${rect.width}px`;
        cursor.style.height = `${rect.height}px`;
        // cursor.style.borderRadius = window.getComputedStyle(pointerEl).borderRadius || "8px";
        cursor.style.background = "#ffffff40";
        cursor.style.display = "block";
        cursor.style.transform = "scale(1)";
        lastPointerElement = pointerEl;
      }
    }
    function pointerOutHandler(e: Event) {
      // On pointer out, revert to default size and hide if not over any pointer element
      disableTransition();
      cursor.style.width = defaultSize + "px";
      cursor.style.height = defaultSize + "px";
      //   cursor.style.borderRadius = "50%";
      cursor.style.background = "#ffffff60";
      lastPointerElement = null;
    }
    document.body.addEventListener("mouseover", pointerOverHandler);
    document.body.addEventListener("mouseout", pointerOutHandler);

    // Hide cursor on mobile when not touching
    cursor.style.display = "none";

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      !isMobileDevice() && window.removeEventListener("mousedown", (e) =>
        showRipple(e.clientX, e.clientY)
      );
      window.removeEventListener("touchmove", moveTouchCursor);
      window.removeEventListener("touchstart", (e) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
        //   moveTouchCursor(e);
          showRipple(touch.clientX, touch.clientY);
        }
      });
      window.removeEventListener("touchend", hideTouchCursor);
      window.removeEventListener("touchcancel", hideTouchCursor);
      document.body.removeEventListener("mouseover", pointerOverHandler);
      document.body.removeEventListener("mouseout", pointerOutHandler);
      if (transitionTimeout !== null) {
        clearTimeout(transitionTimeout);
        transitionTimeout = null;
      }
      lastPointerElement = null;
      if (cursor.parentNode) cursor.parentNode.removeChild(cursor);
    };
  }, []);
}