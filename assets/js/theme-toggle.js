/**
 * Theme Toggle Functionality
 * Handles switching between light and dark themes
 */

(function() {
    'use strict';

    // Get saved theme from localStorage or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
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
            localStorage.setItem('theme', newTheme);
            
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
        document.body.appendChild(toggle);
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeThemeToggle);
    } else {
        initializeThemeToggle();
    }
    
    // Handle system theme preference changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', function(e) {
            // Only auto-switch if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                const systemTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', systemTheme);
                
                // Update toggle button if it exists
                const toggleButton = document.querySelector('.theme-toggle');
                if (toggleButton) {
                    updateToggleIcon(toggleButton, systemTheme);
                }
            }
        });
    }
})();