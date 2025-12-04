class AudioVisualizer {
    constructor() {
        this.canvas = document.getElementById('spectrumCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.sensitivitySlider = document.getElementById('sensitivitySlider');
        this.masterVolumeSlider = document.getElementById('masterVolumeSlider');
        this.volumeText = document.getElementById('volumeText');
        this.dbText = document.getElementById('dbText');
        this.peakFreqText = document.getElementById('peakFreqText');
        this.freqRangeText = document.getElementById('freqRangeText');

        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.sensitivity = 300;
        this.masterVolume = 50;
        this.dataArray = null;
        this.bufferLength = 0;
        this.animationId = null;
        this.barCount = 48;
        this.smoothedValues = [];
        this.currentDb = -Infinity;
        this.peakFrequency = 0;
        this.sampleRate = 44100;

        this.setupCanvas();
        this.setupEventListeners();
        this.initAudio();
    }

    setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.getBoundingClientRect();
        
        // キャンバスサイズ設定
        const width = rect.width || 300;
        const height = rect.height || 150;
        
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvasWidth = width;
        this.canvasHeight = height;
    }

    setupEventListeners() {
        this.sensitivitySlider.addEventListener('input', (e) => {
            this.sensitivity = parseFloat(e.target.value);
        });

        this.masterVolumeSlider.addEventListener('input', (e) => {
            this.masterVolume = parseFloat(e.target.value);
            this.volumeText.textContent = `${this.masterVolume}%`;
        });

        window.addEventListener('resize', () => {
            this.setupCanvas();
        });
    }

    async initAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.sampleRate = this.audioContext.sampleRate;
            
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: false
                }
            });

            this.microphone = this.audioContext.createMediaStreamSource(stream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.analyser.minDecibels = -90;
            this.analyser.maxDecibels = 0;
            
            this.bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(this.bufferLength);
            
            // マイクをアナライザーに接続（接続のみ、スピーカーには出力しない）
            this.microphone.connect(this.analyser);
            
            this.smoothedValues = new Array(this.barCount).fill(0);
            this.startVisualization();
            
            this.freqRangeText.textContent = `20-${Math.min(20000, this.sampleRate / 2) / 1000}k Hz`;
        } catch (error) {
            console.log('Microphone access denied or not available:', error);
            // マイクがない場合はダミー表示
            this.startDummyVisualization();
        }
    }

    startDummyVisualization() {
        // テストデータを使用した可視化
        this.smoothedValues = new Array(this.barCount).fill(0);
        const animate = () => {
            this.dataArray = new Uint8Array(this.bufferLength);
            for (let i = 0; i < this.bufferLength; i++) {
                this.dataArray[i] = Math.sin(i / 50 + Date.now() / 500) * 50 + 128;
            }
            this.drawSpectrum();
            this.updateAnalysisInfo();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    startVisualization() {
        const animate = () => {
            this.analyser.getByteFrequencyData(this.dataArray);
            this.drawSpectrum();
            this.updateAnalysisInfo();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    drawSpectrum() {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        const minFreq = 20;
        const maxFreq = Math.min(20000, this.sampleRate / 2);
        const freqRatio = maxFreq / minFreq;

        const barWidth = this.canvasWidth / this.barCount;
        const gap = Math.max(1, barWidth * 0.1);

        for (let i = 0; i < this.barCount; i++) {
            const t1 = i / this.barCount;
            const t2 = (i + 1) / this.barCount;
            
            const freq1 = minFreq * Math.pow(freqRatio, t1);
            const freq2 = minFreq * Math.pow(freqRatio, t2);
            
            const bin1 = Math.floor(freq1 * this.bufferLength / (this.sampleRate / 2));
            const bin2 = Math.floor(freq2 * this.bufferLength / (this.sampleRate / 2));
            
            let sum = 0;
            let count = 0;
            
            for (let j = bin1; j < Math.min(bin2, this.bufferLength); j++) {
                sum += this.dataArray[j];
                count++;
            }
            
            const average = count > 0 ? sum / count : 0;
            
            // 低周波をブースト
            const freqBoost = 1.0 + (1.0 - t1) * 0.5;
            let targetHeight = (average / 255) * this.sensitivity * this.canvasHeight * freqBoost * (this.masterVolume / 100);
            targetHeight = Math.min(this.canvasHeight - 5, targetHeight);
            targetHeight = Math.max(3, targetHeight);

            // スムージング
            const smoothFactor = 0.3;
            const decayFactor = 0.15;
            
            if (targetHeight > this.smoothedValues[i]) {
                this.smoothedValues[i] += (targetHeight - this.smoothedValues[i]) * smoothFactor;
            } else {
                this.smoothedValues[i] += (targetHeight - this.smoothedValues[i]) * decayFactor;
            }

            const finalHeight = Math.max(3, this.smoothedValues[i]);
            
            // グラデーション色
            const hue = (i / this.barCount) * 360;
            const color = `hsl(${hue}, 100%, 50%)`;
            
            this.ctx.fillStyle = color;
            this.ctx.fillRect(
                i * barWidth + gap / 2,
                this.canvasHeight - finalHeight,
                barWidth - gap,
                finalHeight
            );
        }

        // 計算用：dB値
        const rms = Math.sqrt(
            this.dataArray.reduce((sum, val) => sum + (val * val), 0) / this.dataArray.length
        );
        this.currentDb = rms > 0 ? 20 * Math.log10(rms / 255) : -Infinity;

        // ピーク周波数
        let maxVal = 0;
        let maxBin = 0;
        for (let i = 0; i < Math.min(this.bufferLength, 1024); i++) {
            if (this.dataArray[i] > maxVal) {
                maxVal = this.dataArray[i];
                maxBin = i;
            }
        }
        this.peakFrequency = maxBin * (this.sampleRate / 2) / this.bufferLength;
    }

    updateAnalysisInfo() {
        // dB表示
        if (this.currentDb < -60) {
            this.dbText.textContent = '-∞ dB';
        } else {
            this.dbText.textContent = `${this.currentDb.toFixed(1)} dB`;
        }

        // ピーク周波数
        if (this.peakFrequency < 1) {
            this.peakFreqText.textContent = '-- Hz';
        } else if (this.peakFrequency >= 1000) {
            this.peakFreqText.textContent = `${(this.peakFrequency / 1000).toFixed(1)} kHz`;
        } else {
            this.peakFreqText.textContent = `${Math.round(this.peakFrequency)} Hz`;
        }
    }

    cleanup() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.microphone) {
            this.microphone.disconnect();
        }
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
    }
}

// クラス定義のみ（dashboard.htmlで初期化）
