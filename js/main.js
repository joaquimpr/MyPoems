import { loadPoems } from "./services/poemsService.js";
import { createReader } from "./reader.js";
import { createNavigation } from "./navigation.js";
import { createMenu } from "./menu.js";
import { initTheme } from "./theme.js";

const app = {
    initialized: false,
    reader: null,
    navigation: null,
};

async function initializeApp() {
    if (app.initialized) {
        return;
    }

    // Initialize theme
    const themeButton = document.querySelector("#theme-toggle");
    initTheme(themeButton, ["light", "dark", "forest", "midnight"]);

    const readerElement = document.querySelector("#reader");
    const readerContent = document.querySelector("#reader-content");
    const menuContainer = document.querySelector("#menu");

    // Fetch poems
    const poems = await loadPoems();

    if (!poems || poems.length === 0) {
        readerContent.textContent = "Não foi possível carregar os poemas.";
        return;
    }

    // Initialize modules
    app.reader = createReader(poems, readerContent);
    app.navigation = createNavigation(app.reader, readerElement);

    createMenu(app.reader, poems, menuContainer);

    app.initialized = true;
}

initializeApp();
