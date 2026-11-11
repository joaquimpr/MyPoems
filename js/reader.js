import { splitIntoWords, splitIntoCharacters } from "./utils/typography.js";

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
        const wrapper = document.createElement("div");
        wrapper.className = "reader__intro-group";
        wrapper.innerHTML = `
            <p class="reader__eyebrow">Poemas de Joaquim</p>
            <h1 class="reader__title">
                ${splitIntoCharacters("Entre", 0)} ${splitIntoCharacters("Linhas", 5)}
            </h1>
            <p class="reader__hint">Toca para começar</p>
        `;
        container.replaceChildren(wrapper);
    }

    /**
     * Renders the title screen for the current poem.
     */
    function renderPoemTitle() {
        const poem = getCurrentPoem();
        const wrapper = document.createElement("div");
        wrapper.className = "reader__title-group";
        wrapper.innerHTML = `
            <p class="reader__eyebrow">${String(poemIndex + 1).padStart(2, "0")} / ${String(poems.length).padStart(2, "0")}</p>
            <h2 class="reader__poem-title">${splitIntoWords(poem.title)}</h2>
        `;
        container.replaceChildren(wrapper);
    }

    /**
     * Renders the verses of the current poem
     */
    function renderVerses() {
        const poem = getCurrentPoem();
        const poemLines = getPoemLines(poem);

        const currentLine = poemLines[verseIndex - 1];
        const activeStanzaLines = poemLines
            .slice(0, verseIndex)
            .filter((line) => line.stanzaIndex === currentLine.stanzaIndex);

        const stanzaContainer = document.createElement("div");
        stanzaContainer.className = "reader__stanza-wrapper";

        let htmlContent = `
            <p class="reader__eyebrow">${String(poemIndex + 1).padStart(2, "0")} / ${String(poems.length).padStart(2, "0")}</p>
            <div class="reader__stanza">
        `;

        activeStanzaLines.forEach((line, index) => {
            const isLatestLine = index === activeStanzaLines.length - 1;
            const verseClass = `reader__verse ${isLatestLine ? "" : "old"}`;
            
            const lineContent = isLatestLine ? splitIntoWords(line.text) : line.text;
            
            htmlContent += `<p class="${verseClass}">${lineContent}</p>`;
        });

        htmlContent += `</div>`;

        if (verseIndex === poemLines.length) {
            htmlContent += `<p class="reader__hint">Toca para continuar</p>`;
        }

        stanzaContainer.innerHTML = htmlContent;
        container.replaceChildren(stanzaContainer);
    }

    /**
     * Renders the final completion screen.
     */
    function renderEnd() {
        const wrapper = document.createElement("div");
        wrapper.className = "reader__end-group";
        wrapper.innerHTML = `
            <h1 class="reader__title">${splitIntoCharacters("Fim", 0)}</h1>
            <p class="reader__hint">Obrigado por leres</p>
        `;
        container.replaceChildren(wrapper);
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
        isFinished: () => poemIndex >= poems.length,
    };
}