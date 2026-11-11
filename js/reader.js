export function createReader(poems, container) {
    let poemIndex = -1;
    let verseIndex = 0;

    function getCurrentPoem() {
        return poems[poemIndex];
    }

    function getCurrentPoemIndex() {
        return poemIndex;
    }

    function getVerses(poem) {
        return poem.stanzas.flat();
    }

    /**
     * Renders the welcome/introductory screen.
     */
    function renderIntroduction() {
        const eyebrow = document.createElement("p");
        eyebrow.className = "reader__eyebrow";
        eyebrow.textContent = "Poemas de Joaquim";

        const title = document.createElement("h1");
        title.className = "reader__title";
        title.textContent = "Entre Linhas";

        const hint = document.createElement("p");
        hint.className = "reader__hint";
        hint.textContent = "Toca para começar";

        container.replaceChildren(eyebrow, title, hint);
    }

    /**
     * Renders the title screen for the current poem.
     */
    function renderPoemTitle() {
        const poem = getCurrentPoem();

        const eyebrow = document.createElement("p");
        eyebrow.className = "reader__eyebrow";
        eyebrow.textContent = `${String(poemIndex + 1).padStart(2, "0")} / ${String(poems.length).padStart(2, "0")}`;

        const title = document.createElement("h2");
        title.className = "reader__poem-title";
        title.textContent = poem.title;

        container.replaceChildren(eyebrow, title);
    }

    /**
     * Renders the verses of the current poem.
     */
    function renderVerses() {
        const poem = getCurrentPoem();
        const verses = getVerses(poem);

        const eyebrow = document.createElement("p");
        eyebrow.className = "reader__eyebrow";
        eyebrow.textContent = `${String(poemIndex + 1).padStart(2, "0")} / ${String(poems.length).padStart(2, "0")}`;

        const content = document.createElement("div");
        content.className = "reader__verses";

        const currentStanza = [];
        let remainingVerses = verseIndex;

        for (const stanza of poem.stanzas) {
            const visibleVerses = stanza.slice(
                0,
                Math.max(0, Math.min(stanza.length, remainingVerses)),
            );

            if (visibleVerses.length > 0) {
                const stanzaElement = document.createElement("p");
                stanzaElement.className = "reader__stanza";

                stanzaElement.textContent = visibleVerses.join("\n");
                content.append(stanzaElement);
            }

            remainingVerses -= stanza.length;
        }

        container.replaceChildren(eyebrow, content);

        if (verseIndex === verses.length) {
            const hint = document.createElement("p");
            hint.className = "reader__hint";
            hint.textContent = "Toca para continuar";

            container.append(hint);
        }
    }

    /**
     * Renders the final completion screen.
     */
    function renderEnd() {
        const title = document.createElement("h1");
        title.className = "reader__title";
        title.textContent = "Fim";

        const hint = document.createElement("p");
        hint.className = "reader__hint";
        hint.textContent = "Obrigado por leres";

        container.replaceChildren(title, hint);
    }

    /**
     * Main render router that determines which view to display.
     */
    function render() {
        const progressBar = document.querySelector("#progress-bar");

        if (progressBar) {
            let percentage = 0;
            if (poemIndex >= 0 && poemIndex < poems.length) {
                const verses = getVerses(getCurrentPoem());
                percentage = verses.length > 0 ? (verseIndex / verses.length) * 100 : 0;
            } else if (poemIndex >= poems.length) {
                percentage = 100;
            }
            progressBar.style.width = percentage + "%";
        }

        if (poemIndex === -1) {
            renderIntroduction();
            return;
        }

        if (poemIndex >= poems.length) {
            renderEnd();
            return;
        }

        if (verseIndex === 0) {
            renderPoemTitle();
            return;
        }

        renderVerses();
    }

    /**
     * Advances to the next verse, poem, or completion screen.
     */
    function next() {
        if (poemIndex === -1) {
            poemIndex = 0;
            verseIndex = 0;
        } else if (poemIndex >= poems.length) {
            return;
        } else {
            const verses = getVerses(getCurrentPoem());

            if (verseIndex < verses.length) {
                verseIndex++;
            } else {
                poemIndex++;
                verseIndex = 0;
            }
        }

        render();
    }

    /**
     * Moves back to the previous verse, poem title, or introduction screen.
     */
    function previous() {
        if (poemIndex === -1) {
            return;
        }

        if (poemIndex >= poems.length) {
            poemIndex = poems.length - 1;
            verseIndex = getVerses(getCurrentPoem()).length;
        } else if (verseIndex > 0) {
            verseIndex--;
        } else if (poemIndex === 0) {
            poemIndex = -1;
            verseIndex = 0;
        } else {
            poemIndex--;
            verseIndex = getVerses(getCurrentPoem()).length;
        }

        render();
    }

    /**
     * Resets the reader state back to the introduction.
     */
    function reset() {
        poemIndex = -1;
        verseIndex = 0;
        render();
    }

    function getProgress() {
        if (poemIndex < 0 || poemIndex >= poems.length) {
            return null;
        }

        const verses = getVerses(getCurrentPoem());

        return {
            poemIndex,
            verseIndex,
            totalVerses: verses.length,
        };
    }

    function goToPoem(index) {
        if (index < 0 || index >= poems.length) {
            return;
        }

        poemIndex = index;
        verseIndex = 0;

        render();
    }

    render();

    return {
        next,
        previous,
        reset,
        getProgress,
        goToPoem,
        getCurrentPoemIndex,
    };
}
