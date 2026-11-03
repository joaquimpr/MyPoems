
"use strict";

import { poems } from "./poems.js";
import { createReader } from "./reader.js";

const app = {
    initialized: false,
    reader: null
};

function initializeApp() {
    if (app.initialized) {
        return;
    }

    const readerElement = document.querySelector("#reader");
    const readerContent = document.querySelector("#reader-content");

    app.reader = createReader(poems, readerContent);

    readerElement.addEventListener("click", () => {
        app.reader.next();
    });

    app.initialized = true;
}

initializeApp();
