export async function loadPoems() {
    const CACHE_KEY = "reader_poems_cache";
    const CACHE_TIME_KEY = "reader_poems_time";
    const ONE_HOUR = 60 * 60 * 1000;
    const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxMGlJI9rZH8bC2RhaLmwUocRJajMsadd85lY5JssxhwuQT6-ux-XIQt6VdOrsit-x2/exec";
    
    const cachedPoems = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    
    // Use localStorage cache if it's valid and less than 1 hour old
    if (cachedPoems && cachedTime && (Date.now() - cachedTime < ONE_HOUR)) {
        return JSON.parse(cachedPoems);
    }
    
    try {
        // Fetch poem data
        const response = await fetch(WEB_APP_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const poems = await response.json();
        
        // Save the data and current timestamp to localStorage
        localStorage.setItem(CACHE_KEY, JSON.stringify(poems));
        localStorage.setItem(CACHE_TIME_KEY, Date.now());
        
        return poems;
    } catch (error) {
        console.error("Failed to fetch poems from server, falling back to cache:", error);
        
        // Fallback to cache if offline or network error occurs
        return cachedPoems ? JSON.parse(cachedPoems) : [];
    }
}