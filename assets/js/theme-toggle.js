/**
 * Theme Toggle Functionality
 * Handles switching between light and dark themes
 */

(function() {
    'use strict';

    // The site always loads LIGHT unless this visitor has explicitly chosen dark
    // with the toggle. The choice is stored under a versioned key: the old
    // 'theme' key from the dark-by-default era is deliberately ignored (and
    // cleared), so nobody is stuck on a stale dark preference. The OS colour
    // scheme is never consulted.
    const DEFAULT_THEME = 'light';
    const STORAGE_KEY = 'theme-v2';
    try { localStorage.removeItem('theme'); } catch (e) { /* storage may be blocked */ }
    let savedTheme = DEFAULT_THEME;
    try { savedTheme = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME; } catch (e) { /* ignore */ }
    
    // Apply saved theme on page load
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Create theme toggle button
    function createThemeToggle() {
        const toggleButton = document.createElement('button');
        toggleButton.className = 'theme-toggle';
        toggleButton.setAttribute('aria-label', 'Toggle dark/light theme');
        toggleButton.setAttribute('title', 'Toggle theme');
        
        // Set initial icon based on current theme
        updateToggleIcon(toggleButton, savedTheme);
        
        // Add click event listener
        toggleButton.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Apply new theme
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Save to localStorage
            try { localStorage.setItem(STORAGE_KEY, newTheme); } catch (e) { /* ignore */ }
            
            // Update button icon
            updateToggleIcon(toggleButton, newTheme);
        });
        
        return toggleButton;
    }
    
    // Update toggle button icon based on current theme
    function updateToggleIcon(button, theme) {
        if (theme === 'dark') {
            button.innerHTML = '<i class="fas fa-sun"></i>';
            button.setAttribute('title', 'Switch to light theme');
        } else {
            button.innerHTML = '<i class="fas fa-moon"></i>';
            button.setAttribute('title', 'Switch to dark theme');
        }
    }
    
    // Initialize theme toggle when DOM is ready
    function initializeThemeToggle() {
        const toggle = createThemeToggle();
        // Sit under the "On this page" rail when the page has one, so the
        // button reads as part of the page instead of floating in the corner
        // of the window. Pages without a rail keep the fixed corner button,
        // and CSS re-pins it to the corner on phones, where the rail sits at
        // the very top of a stacked page.
        const host = document.querySelector(".toc-rail") || document.body;
        host.appendChild(toggle);
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeThemeToggle);
    } else {
        initializeThemeToggle();
    }
    
})();