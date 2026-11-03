"use strict";

const app = {
    initialized: false,
};

function initializeApp() {
    if (app.initialized) {
        return;
    }

    app.initialized = true;

    console.log("App started.");
}

initializeApp();
