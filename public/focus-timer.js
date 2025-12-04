class FocusTimer {
    constructor() {
        // DOM要素
        this.timerDisplay = document.getElementById('timerDisplay');
        this.modeText = document.getElementById('modeText');
        this.timerProgress = document.getElementById('timerProgress');
        this.pauseButton = document.getElementById('pauseButton');
        this.completeButton = document.getElementById('completeButton');
        this.resetButton = document.getElementById('resetButton');
        this.shortBreakBtn = document.getElementById('shortBreakBtn');
        this.longBreakBtn = document.getElementById('longBreakBtn');
        
        // 設定要素
        this.focusDurationBox = document.getElementById('focusDurationBox');
        this.shortBreakBox = document.getElementById('shortBreakBox');
        this.longBreakBox = document.getElementById('longBreakBox');
        this.intervalBox = document.getElementById('intervalBox');
        this.focusSoundSlider = document.getElementById('focusSoundSlider');
        this.focusSoundText = document.getElementById('focusSoundText');

        // 状態管理
        this.timeRemaining = 0;
        this.totalTime = 0;
        this.isRunning = false;
        this.isFocusMode = true;
        this.completedSessions = 0;
        
        // 設定値
        this.focusDuration = 25;
        this.shortBreakDuration = 5;
        this.longBreakDuration = 15;
        this.interval = 4;

        // タイマー
        this.timerInterval = null;
        
        // イベントリスナー
        this.setupEventListeners();
        
        // 初期化
        this.setFocusMode();
        this.updateModeText();
        
        // ローカルストレージから設定を復元
        this.loadSettings();
    }

    setupEventListeners() {
        this.pauseButton.addEventListener('click', () => this.togglePauseResume());
        this.completeButton.addEventListener('click', () => this.completeSession());
        this.resetButton.addEventListener('click', () => this.reset());
        this.shortBreakBtn.addEventListener('click', () => this.setShortBreakMode());
        this.longBreakBtn.addEventListener('click', () => this.setLongBreakMode());

        this.focusDurationBox.addEventListener('change', () => this.handleDurationChange());
        this.shortBreakBox.addEventListener('change', () => this.handleDurationChange());
        this.longBreakBox.addEventListener('change', () => this.handleDurationChange());
        this.intervalBox.addEventListener('change', () => this.handleDurationChange());
        
        this.focusSoundSlider.addEventListener('input', (e) => this.updateSoundVolume(e));
    }

    setFocusMode() {
        this.isFocusMode = true;
        this.totalTime = this.focusDuration * 60; // 秒単位
        this.timeRemaining = this.totalTime;
        this.updateDisplay();
        this.pauseButton.textContent = 'Start';
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.isRunning = false;
    }

    setShortBreakMode() {
        this.isFocusMode = false;
        this.totalTime = this.shortBreakDuration * 60;
        this.timeRemaining = this.totalTime;
        this.updateDisplay();
        this.pauseButton.textContent = 'Start';
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.isRunning = false;
    }

    setLongBreakMode() {
        this.isFocusMode = false;
        this.totalTime = this.longBreakDuration * 60;
        this.timeRemaining = this.totalTime;
        this.updateDisplay();
        this.pauseButton.textContent = 'Start';
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.isRunning = false;
    }

    togglePauseResume() {
        if (this.isRunning) {
            this.pause();
        } else {
            this.resume();
        }
    }

    pause() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.isRunning = false;
        this.pauseButton.textContent = 'Resume';
    }

    resume() {
        this.isRunning = true;
        this.pauseButton.textContent = 'Pause';
        
        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateDisplay();

            if (this.timeRemaining <= 0) {
                this.timerComplete();
            }
        }, 1000);
    }

    timerComplete() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.isRunning = false;
        this.pauseButton.textContent = 'Start';

        if (this.isFocusMode) {
            this.completedSessions++;
            this.updateModeText();
            this.playNotification();
            
            // セッション統計に通知
            window.dispatchEvent(new CustomEvent('sessionCompleted', {
                detail: { duration: this.focusDuration }
            }));
            
            if (this.completedSessions % this.interval === 0) {
                this.showNotification(`Focus session #${this.completedSessions} completed! Time for a long break.`);
                this.setLongBreakMode();
            } else {
                this.showNotification(`Focus session #${this.completedSessions} completed! Time for a short break.`);
                this.setShortBreakMode();
            }
        } else {
            this.playNotification();
            this.showNotification('Break time is over! Ready for another focus session?');
            this.setFocusMode();
        }

        // 設定を保存
        this.saveSettings();
    }

    completeSession() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.isRunning = false;

        if (this.isFocusMode) {
            this.completedSessions++;
            this.updateModeText();
            this.playNotification();
            this.showNotification(`Focus session #${this.completedSessions} completed!`);
            
            // セッション統計に通知
            window.dispatchEvent(new CustomEvent('sessionCompleted', {
                detail: { duration: this.focusDuration }
            }));
            
            this.setShortBreakMode();
        } else {
            this.setFocusMode();
        }

        this.saveSettings();
    }

    reset() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.isRunning = false;

        if (this.isFocusMode) {
            this.setFocusMode();
        } else {
            this.timeRemaining = this.totalTime;
        }

        this.updateDisplay();
        this.pauseButton.textContent = 'Start';
    }

    handleDurationChange() {
        const newFocus = parseInt(this.focusDurationBox.value) || 25;
        const newShortBreak = parseInt(this.shortBreakBox.value) || 5;
        const newLongBreak = parseInt(this.longBreakBox.value) || 15;
        const newInterval = parseInt(this.intervalBox.value) || 4;

        this.focusDuration = Math.max(1, newFocus);
        this.shortBreakDuration = Math.max(1, newShortBreak);
        this.longBreakDuration = Math.max(1, newLongBreak);
        this.interval = Math.max(1, newInterval);

        this.focusDurationBox.value = this.focusDuration;
        this.shortBreakBox.value = this.shortBreakDuration;
        this.longBreakBox.value = this.longBreakDuration;
        this.intervalBox.value = this.interval;

        this.updateBreakButtonText();
        this.saveSettings();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (this.totalTime > 0) {
            const progress = 1.0 - (this.timeRemaining / this.totalTime);
            this.timerProgress.style.width = `${progress * 100}%`;
        }
    }

    updateModeText() {
        const mode = this.isFocusMode ? 'Focus' : 'Break';
        this.modeText.textContent = `Mode: ${mode} (${this.completedSessions} sessions complete)`;
    }

    updateBreakButtonText() {
        this.shortBreakBtn.textContent = `Start Break (${this.shortBreakDuration} min)`;
        this.longBreakBtn.textContent = `Start Long Break (${this.longBreakDuration} min)`;
    }

    updateSoundVolume(event) {
        const volume = event.target.value;
        this.focusSoundText.textContent = `${volume}%`;
        this.saveSettings();
    }

    playNotification() {
        // ブラウザの制限により、実際の音声再生にはユーザー操作後のコンテキストが必要
        // 簡単な視覚的フィードバックを提供
        const volume = parseInt(this.focusSoundSlider.value) / 100;
        if (volume > 0) {
            // オプション: Web Audio APIで音声生成
            this.playTone(1000, 0.3, volume);
        }
    }

    playTone(frequency, duration, volume) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            console.log('Audio context not available:', e);
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    saveSettings() {
        const settings = {
            focusDuration: this.focusDuration,
            shortBreakDuration: this.shortBreakDuration,
            longBreakDuration: this.longBreakDuration,
            interval: this.interval,
            soundVolume: parseInt(this.focusSoundSlider.value),
            completedSessions: this.completedSessions
        };
        localStorage.setItem('focusTimerSettings', JSON.stringify(settings));
    }

    loadSettings() {
        const saved = localStorage.getItem('focusTimerSettings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                this.focusDuration = settings.focusDuration || 25;
                this.shortBreakDuration = settings.shortBreakDuration || 5;
                this.longBreakDuration = settings.longBreakDuration || 15;
                this.interval = settings.interval || 4;
                this.completedSessions = settings.completedSessions || 0;
                
                this.focusDurationBox.value = this.focusDuration;
                this.shortBreakBox.value = this.shortBreakDuration;
                this.longBreakBox.value = this.longBreakDuration;
                this.intervalBox.value = this.interval;
                this.focusSoundSlider.value = settings.soundVolume || 50;
                this.focusSoundText.textContent = `${this.focusSoundSlider.value}%`;
                
                this.updateBreakButtonText();
                this.updateModeText();
            } catch (e) {
                console.log('Failed to load settings:', e);
            }
        }
    }
}

// クラス定義のみ（dashboard.htmlで初期化）
