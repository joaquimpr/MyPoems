export function createReader(poems, container) {
    let poemIndex = -1;
    let verseIndex = 0;

    function getCurrentPoem() {
        return poems[poemIndex];
    }

    function getCurrentPoemIndex() {
        return poemIndex;
    }

    function getPoemLines(poem) {
        const lines = [];
        poem.stanzas.forEach((stanza, stanzaIndex) => {
            stanza.forEach((verseText) => {
                lines.push({ stanzaIndex, text: verseText });
            });
        });
        return lines;
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
     * Renders the verses of the current poem
     */
    function renderVerses() {
        const poem = getCurrentPoem();
        const poemLines = getPoemLines(poem);

        const eyebrow = document.createElement("p");
        eyebrow.className = "reader__eyebrow";
        eyebrow.textContent = `${String(poemIndex + 1).padStart(2, "0")} / ${String(poems.length).padStart(2, "0")}`;

        const content = document.createElement("div");
        content.className = "reader__stanza";

        const currentLine = poemLines[verseIndex - 1];
        const activeStanzaLines = poemLines
            .slice(0, verseIndex)
            .filter((line) => line.stanzaIndex === currentLine.stanzaIndex);

        activeStanzaLines.forEach((line, index) => {
            const verseElement = document.createElement("p");
            const isLatestLine = index === activeStanzaLines.length - 1;

            verseElement.className = "reader__verse" + (isLatestLine ? "" : " old");
            verseElement.textContent = line.text;
            content.append(verseElement);
        });

        container.replaceChildren(eyebrow, content);

        if (verseIndex === poemLines.length) {
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
                const poemLines = getPoemLines(getCurrentPoem());
                percentage = poemLines.length > 0 ? (verseIndex / poemLines.length) * 100 : 0;
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
            const poemLines = getPoemLines(getCurrentPoem());

            if (verseIndex < poemLines.length) {
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
            verseIndex = getPoemLines(getCurrentPoem()).length;
        } else if (verseIndex > 0) {
            verseIndex--;
        } else if (poemIndex === 0) {
            poemIndex = -1;
            verseIndex = 0;
        } else {
            poemIndex--;
            verseIndex = getPoemLines(getCurrentPoem()).length;
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

        const poemLines = getPoemLines(getCurrentPoem());

        return {
            poemIndex,
            verseIndex,
            totalVerses: poemLines.length,
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
