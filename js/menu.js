export function createMenu(reader, poems, container) {
    const indexToggleBtn = document.querySelector("#index-toggle");
    let menuOpen = false;

    function render() {
        container.innerHTML = `
            <div class="menu-grid">
                ${poems
                    .map(
                        (poem, index) => `
                    <div class="poem-card" data-index="${index}">
                        <div>
                            <small>${String(index + 1).padStart(2, "0")}</small>
                        </div>
                        <span>${poem.title || poem.t}</span>
                    </div>
                `,
                    )
                    .join("")}
            </div>
        `;
    }

    function toggle(forceState) {
        menuOpen = forceState !== undefined ? forceState : !menuOpen;
        container.classList.toggle("on", menuOpen);
        indexToggleBtn.textContent = menuOpen ? "Fechar" : "Índice";

        if (menuOpen) {
            const currentIndex = reader ? reader.getCurrentPoemIndex() : -1;
            
            container.querySelectorAll(".poem-card").forEach((item, index) => {
                item.classList.toggle("active", index === currentIndex);
            });
        }
    }

    // Event listeners
    indexToggleBtn.addEventListener("click", () => toggle());

    container.addEventListener("click", (e) => {
        const item = e.target.closest("[data-index]");
        if (item) {
            const poemIndex = parseInt(item.dataset.index, 10);
            toggle(false);

            // Navigate to the selected poem in the reader
            if (reader) {
                reader.goToPoem(poemIndex);
            }
        }
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && menuOpen) {
            toggle(false);
        }
    });

    render();

    return {
        isOpen: () => menuOpen,
    };
}
