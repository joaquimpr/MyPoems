export function createNavigation(reader, readerElement) {
    const INTERACTIVE_ELEMENTS =
        "button, a, input, textarea, select, [contenteditable='true']";
    const WHEEL_COOLDOWN_MS = 50;
    const MIN_WHEEL_DELTA = 20;
    const MIN_SWIPE_DISTANCE = 60;
    const SWIPE_CLICK_COOLDOWN_MS = 500;

    const FORWARD_KEYS = ["ArrowRight", "ArrowDown", "PageDown", "Enter", " "];
    const BACKWARD_KEYS = ["ArrowLeft", "ArrowUp", "PageUp", "Backspace"];

    let wheelLocked = false;
    let touchStartY = null;
    let ignoreClickUntil = 0;

    // Add event listeners for mouse wheel, touch, and click events
    function handleClick(event) {
        // Ignore clicks if they occur too soon after a swipe
        if (Date.now() < ignoreClickUntil) {
            return;
        }

        const interactiveElement = event.target.closest(INTERACTIVE_ELEMENTS);

        // If the click is on an interactive element, ignore it
        if (interactiveElement) {
            return;
        }

        // If the user selected text, ignore the click
        if (window.getSelection()?.toString()) {
            return;
        }

        reader.next();
    }

    // Handle keyboard navigation
    function handleKeyDown(event) {
        const isEditable = event.target.closest(INTERACTIVE_ELEMENTS);

        // Ignores navigation if typing in text fields, or if event was already handled
        if (
            isEditable ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.defaultPrevented
        ) {
            return;
        }

        // Handle navigation based on key presses
        if (FORWARD_KEYS.includes(event.key)) {
            event.preventDefault();
            reader.next();
        } else if (BACKWARD_KEYS.includes(event.key)) {
            event.preventDefault();
            reader.previous();
        }
    }

    // Handle mouse wheel events for navigation
    function handleWheel(event) {
        const deltaY = event.deltaY;

        // Ignore minor scroll movements
        if (Math.abs(deltaY) < MIN_WHEEL_DELTA || wheelLocked) {
            return;
        }

        // Prevent default page scrolling
        event.preventDefault();
        wheelLocked = true;

        // Determine navigation direction based on scroll direction
        if (deltaY > 0) {
            reader.next();
        } else {
            reader.previous();
        }

        window.setTimeout(() => {
            wheelLocked = false;
        }, WHEEL_COOLDOWN_MS);
    }

    // Handle touch events for navigation on mobile devices
    function handleTouchStart(event) {
        // Ignore multi-touch
        if (event.touches.length !== 1) {
            touchStartY = null;
            return;
        }

        touchStartY = event.touches[0].clientY;
    }

    // Handle touch end events for navigation on mobile devices
    function handleTouchEnd(event) {
        // Ignore if touch start was not recorded or if multiple touches ended
        if (touchStartY === null || event.changedTouches.length !== 1) {
            return;
        }

        const touchEndY = event.changedTouches[0].clientY;
        const difference = touchStartY - touchEndY;

        touchStartY = null;

        // Ignore swipes if they are below the minimum threshold
        if (Math.abs(difference) < MIN_SWIPE_DISTANCE) {
            return;
        }

        ignoreClickUntil = Date.now() + SWIPE_CLICK_COOLDOWN_MS;

        if (difference > 0) {
            reader.next();
        } else {
            reader.previous();
        }
    }

    readerElement.addEventListener("click", handleClick);
    readerElement.addEventListener("wheel", handleWheel, { passive: false });
    readerElement.addEventListener("touchstart", handleTouchStart, {
        passive: true,
    });
    readerElement.addEventListener("touchend", handleTouchEnd, {
        passive: true,
    });

    window.addEventListener("keydown", handleKeyDown);

    return function destroyNavigation() {
        readerElement.removeEventListener("click", handleClick);
        readerElement.removeEventListener("wheel", handleWheel);
        readerElement.removeEventListener("touchstart", handleTouchStart);
        readerElement.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener("keydown", handleKeyDown);
    };
}
