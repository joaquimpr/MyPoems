
"use strict";

import { poems } from "./poems.js";
import { createReader } from "./reader.js";
import { createNavigation } from "./navigation.js";

const app = {
    initialized: false,
    reader: null,
    navigation: null,
};

function initializeApp() {
    if (app.initialized) {
        return;
    }

    const readerElement = document.querySelector("#reader");
    const readerContent = document.querySelector("#reader-content");

    app.reader = createReader(poems, readerContent);
    app.navigation = createNavigation(app.reader, readerElement);

    app.initialized = true;
}

initializeApp();
