// Sanitizes string inputs to prevent basic HTML injection
const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Wraps each word in a span so we can animate them one by one
export const splitIntoWords = (text) => text
        .split(" ")
        .map((word, index) => `<span class="animated-word" style="--word-index: ${index}">${escapeHtml(word)}</span>`)
        .join(" ");

// Breaks a string down letter by letter
export const splitIntoCharacters = (text, startIndex = 0) => 
    text
        .split("")
        .map((char, index) => `<span class="animated-char" style="--char-index: ${startIndex + index}">${escapeHtml(char)}</span>`)
        .join("");
