export function createNavigation(reader, readerElement) {
    const INTERACTIVE_ELEMENTS = "button, a, input, textarea, select, [contenteditable='true']";
    const WHEEL_COOLDOWN_MS = 50;
    const MIN_WHEEL_DELTA = 20;

    const FORWARD_KEYS = ["ArrowRight", "ArrowDown", "PageDown", " "];
    const BACKWARD_KEYS = ["ArrowLeft", "ArrowUp", "PageUp", "Backspace"];

    let wheelLocked = false;

    // Add event listeners for mouse wheel, touch, and click events
    function handleClick(event) {
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

    readerElement.addEventListener("click", handleClick);
    readerElement.addEventListener("wheel", handleWheel, {
        passive: false,
    });

    window.addEventListener("keydown", handleKeyDown);

    return function destroyNavigation() {
        readerElement.removeEventListener("click", handleClick);
        readerElement.removeEventListener("wheel", handleWheel);
        window.removeEventListener("keydown", handleKeyDown);
    };
}
