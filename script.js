class ChordTrainer {
    constructor() {
        // Chord definitions - only F# is sharp, all other accidentals are flats
        this.chords = [
            // Major chords
            'C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B',
            // Minor chords
            'Cm', 'D♭m', 'Dm', 'E♭m', 'Em', 'Fm', 'F♯m', 'G♭m', 'Gm', 'A♭m', 'Am', 'B♭m', 'Bm'
        ];
        
        // Default settings
        this.settings = {
            sessionDuration: 10, // minutes
            chordInterval: 5, // seconds
            isDayMode: false
        };
        
        // Timers
        this.sessionTimer = null;
        this.chordTimer = null;
        this.sessionTimeLeft = 0;
        this.chordTimeLeft = 0;
        this.settingsHideTimeout = null;
        
        // DOM elements
        this.chordDisplay = document.getElementById('chordDisplay');
        this.sessionTimerDisplay = document.getElementById('sessionTimer');
        this.chordTimerDisplay = document.getElementById('chordTimer');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.settingsToggle = document.getElementById('settingsToggle');
        
        // Settings inputs
        this.sessionDurationSelect = document.getElementById('sessionDuration');
        this.chordIntervalSelect = document.getElementById('chordInterval');
        this.themeToggleButton = document.getElementById('themeToggle');
        
        this.init();
    }
    
    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.startSession();
        this.showRandomChord();
        this.updateThemeIcon();
    }
    
    loadSettings() {
        // Load settings from localStorage if available
        const savedSettings = localStorage.getItem('chordTrainerSettings');
        if (savedSettings) {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        }
        
        // Update UI with loaded settings
        this.sessionDurationSelect.value = this.settings.sessionDuration;
        this.chordIntervalSelect.value = this.settings.chordInterval;
        
        // Apply theme
        this.applyTheme();
    }
    
    saveSettings() {
        localStorage.setItem('chordTrainerSettings', JSON.stringify(this.settings));
    }
    
    setupEventListeners() {
        // Settings toggle - show on hover
        this.settingsToggle.addEventListener('mouseenter', () => {
            this.showSettings();
        });
        
        // Hide settings when mouse leaves the settings area
        this.settingsPanel.addEventListener('mouseleave', () => {
            this.scheduleSettingsHide();
        });
        
        // Keep settings visible when hovering over the panel
        this.settingsPanel.addEventListener('mouseenter', () => {
            this.clearSettingsHideTimeout();
        });
        
        // Session duration change - instant apply
        this.sessionDurationSelect.addEventListener('change', () => {
            this.settings.sessionDuration = parseInt(this.sessionDurationSelect.value);
            this.saveSettings();
            this.restartSession();
            this.scheduleSettingsHide();
        });
        
        // Chord interval change - instant apply
        this.chordIntervalSelect.addEventListener('change', () => {
            this.settings.chordInterval = parseInt(this.chordIntervalSelect.value);
            this.saveSettings();
            this.restartChordTimer();
            this.scheduleSettingsHide();
        });
        
        // Theme toggle
        this.themeToggleButton.addEventListener('click', () => {
            this.settings.isDayMode = !this.settings.isDayMode;
            this.applyTheme();
            this.updateThemeIcon();
            this.saveSettings();
            this.scheduleSettingsHide();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.showRandomChord();
            } else if (e.code === 'Escape') {
                this.hideSettings();
            } else if (e.code === 'KeyS' && e.ctrlKey) {
                e.preventDefault();
                this.toggleSettings();
            }
        });
        

    }
    
    applyTheme() {
        if (this.settings.isDayMode) {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }
    
    updateThemeIcon() {
        // Update icon based on current theme
        this.themeToggleButton.textContent = this.settings.isDayMode ? '☀️' : '🌙';
    }
    
    toggleSettings() {
        const isVisible = this.settingsPanel.classList.contains('show');
        if (isVisible) {
            this.hideSettings();
        } else {
            this.showSettings();
        }
    }
    
    showSettings() {
        this.settingsPanel.classList.add('show');
        this.settingsToggle.classList.add('hidden');
        this.scheduleSettingsHide();
    }
    
    hideSettings() {
        this.settingsPanel.classList.remove('show');
        this.settingsToggle.classList.remove('hidden');
        this.clearSettingsHideTimeout();
    }
    
    scheduleSettingsHide() {
        this.clearSettingsHideTimeout();
        this.settingsHideTimeout = setTimeout(() => {
            this.hideSettings();
        }, 3000); // Hide after 3 seconds (increased from 1 second for better UX)
    }
    
    clearSettingsHideTimeout() {
        if (this.settingsHideTimeout) {
            clearTimeout(this.settingsHideTimeout);
            this.settingsHideTimeout = null;
        }
    }
    
    restartSession() {
        this.stopSession();
        this.startSession();
    }
    
    restartChordTimer() {
        // Only restart chord timer, keep session timer running
        if (this.chordTimer) {
            clearInterval(this.chordTimer);
            this.chordTimer = null;
        }
        this.startChordTimer();
    }
    
    showNotification(message) {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: var(--panel-bg);
            color: var(--text-color);
            padding: 16px 24px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            z-index: 1000;
            font-size: 14px;
            font-weight: 500;
            font-family: 'Inter', sans-serif;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 2000);
    }
    
    startSession() {
        // Set session duration
        this.sessionTimeLeft = this.settings.sessionDuration * 60; // Convert to seconds
        this.chordTimeLeft = this.settings.chordInterval;
        
        // Start timers
        this.updateTimerDisplays();
        
        this.sessionTimer = setInterval(() => {
            this.sessionTimeLeft--;
            this.updateSessionTimer();
            
            if (this.sessionTimeLeft <= 0) {
                this.endSession();
            }
        }, 1000);
        
        this.startChordTimer();
    }
    
    startChordTimer() {
        this.chordTimeLeft = this.settings.chordInterval;
        
        this.chordTimer = setInterval(() => {
            this.chordTimeLeft--;
            this.updateChordTimer();
            
            if (this.chordTimeLeft <= 0) {
                this.showRandomChord();
                this.resetChordTimer();
            }
        }, 1000);
    }
    
    resetChordTimer() {
        this.chordTimeLeft = this.settings.chordInterval;
    }
    
    stopSession() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
        }
        
        if (this.chordTimer) {
            clearInterval(this.chordTimer);
            this.chordTimer = null;
        }
    }
    
    endSession() {
        this.stopSession();
        this.showNotification('Сессия завершена!');
        
        // Restart session after 3 seconds
        setTimeout(() => {
            this.startSession();
        }, 3000);
    }
    
    updateTimerDisplays() {
        this.updateSessionTimer();
        this.updateChordTimer();
    }
    
    updateSessionTimer() {
        const minutes = Math.floor(this.sessionTimeLeft / 60);
        const seconds = this.sessionTimeLeft % 60;
        this.sessionTimerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateChordTimer() {
        // Show countdown from full interval to 1 (more intuitive)
        const displayTime = this.chordTimeLeft === 0 ? this.settings.chordInterval : this.chordTimeLeft;
        this.chordTimerDisplay.textContent = displayTime.toString();
    }
    
    showRandomChord() {
        const randomIndex = Math.floor(Math.random() * this.chords.length);
        const chord = this.chords[randomIndex];
        
        // Add animation effect
        this.chordDisplay.style.opacity = '0';
        this.chordDisplay.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            this.chordDisplay.textContent = chord;
            this.chordDisplay.style.opacity = '1';
            this.chordDisplay.style.transform = 'scale(1)';
        }, 150);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChordTrainer();
});
