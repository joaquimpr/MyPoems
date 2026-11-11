export function initPoemSlider(reader, buttonElement) {
    const SLIDE_INTERVAL_MS = 800;

    let isAutoPoemEnabled = false;
    let intervalId = null;

    // Advances to the next line/stanza if auto mode is active
    function autoAdvancePoem() {
        if (!isAutoPoemEnabled) {
            return;
        }

        reader.next();
    }
 
    // Toggles the auto poem state
    function toggleAutoPoem() {
        isAutoPoemEnabled = !isAutoPoemEnabled;
        buttonElement.textContent = isAutoPoemEnabled ? "Pausar" : "Auto";

        buttonElement.classList.toggle("active", isAutoPoemEnabled);

        // Clear the interval if auto mode was turned off
        if (!isAutoPoemEnabled) {
            clearInterval(intervalId);
            return;
        }

        intervalId = setInterval(autoAdvancePoem, SLIDE_INTERVAL_MS);
    }

    buttonElement.addEventListener("click", toggleAutoPoem);
}