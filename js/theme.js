export function initTheme(buttonElement, themes = ["light", "dark"]) {
    // Get the saved theme from localStorage or use system preference
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    let initialTheme = savedTheme;
    if (!initialTheme || !themes.includes(initialTheme)) {
        initialTheme = systemPrefersDark && themes.includes("dark") ? "dark" : themes[0];
    }

    // Apply the initial theme
    document.documentElement.setAttribute("data-theme", initialTheme);

    // Configure the button to cycle through the available themes
    if (buttonElement) {
        buttonElement.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme") || themes[0];
            const currentIndex = themes.indexOf(currentTheme);
            
            // Move to the next theme
            const nextIndex = (currentIndex + 1) % themes.length;
            const newTheme = themes[nextIndex];

            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }
}