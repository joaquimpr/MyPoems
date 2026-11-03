"use strict";

import { poems } from "./poems.js";

const app = {
    initialized: false
};

function initializeApp() {
    if (app.initialized) {
        return;
    }

    app.initialized = true;

    console.log("Poemas disponíveis:", poems.length);
}

initializeApp();
