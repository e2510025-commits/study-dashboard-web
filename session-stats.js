class SessionStats {
    constructor() {
        this.dateTimeline = document.getElementById('dateTimeline');
        this.avgMinText = document.getElementById('avgMinText');
        this.bestDayText = document.getElementById('bestDayText');
        this.bestDayDateText = document.getElementById('bestDayDateText');
        this.activeDaysText = document.getElementById('activeDaysText');
        this.weekTotalText = document.getElementById('weekTotalText');
        this.weekCompareText = document.getElementById('weekCompareText');
        this.weekBarChart = document.getElementById('weekBarChart');
        this.weekLabels = document.getElementById('weekLabels');
        this.maxMinText = document.getElementById('maxMinText');
        this.recentSessionsList = document.getElementById('recentSessionsList');
        this.dailyDetailList = document.getElementById('dailyDetailList');

        this.sessions = [];
        this.dailyMinutes = {};

        this.loadData();
        this.refreshUI();

        // フォーカスタイマーからセッション完了通知を受け取る
        window.addEventListener('sessionCompleted', (e) => {
            this.addSession(e.detail.duration);
        });
    }

    addSession(durationMinutes, taskName = null) {
        const session = {
            dateTime: new Date().toISOString(),
            durationMinutes: durationMinutes,
            taskName: taskName
        };

        this.sessions.push(session);

        const today = this.getDateKey(new Date());
        if (!this.dailyMinutes[today]) {
            this.dailyMinutes[today] = 0;
        }
        this.dailyMinutes[today] += durationMinutes;

        this.saveData();
        this.refreshUI();
    }

    getDateKey(date) {
        return date.toISOString().split('T')[0];
    }

    refreshUI() {
        this.updateDateTimeline();
        this.updateStats();
        this.updateWeekBarChart();
        this.updateRecentSessions();
        this.updateDailyDetail();
    }

    updateDateTimeline() {
        this.dateTimeline.innerHTML = '';
        
        for (let i = 13; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = this.getDateKey(date);
            const dateStr = date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });

            const item = document.createElement('div');
            item.className = 'date-item';
            if (this.dailyMinutes[dateKey] && this.dailyMinutes[dateKey] > 0) {
                item.classList.add('active');
            }
            item.textContent = dateStr;

            this.dateTimeline.appendChild(item);
        }
    }

    updateStats() {
        // 14日間の統計
        let totalMinutes14d = 0;
        let activeDays = 0;

        for (let i = 0; i < 14; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = this.getDateKey(date);
            
            if (this.dailyMinutes[dateKey]) {
                totalMinutes14d += this.dailyMinutes[dateKey];
                if (this.dailyMinutes[dateKey] > 0) activeDays++;
            }
        }

        const avg = activeDays > 0 ? Math.floor(totalMinutes14d / activeDays) : 0;
        this.avgMinText.textContent = `${avg} min`;
        this.activeDaysText.textContent = `${activeDays} / 14`;

        // ベストデイ
        let bestDay = null;
        let bestMin = 0;

        for (const [dateStr, minutes] of Object.entries(this.dailyMinutes)) {
            if (minutes > bestMin) {
                bestMin = minutes;
                bestDay = dateStr;
            }
        }

        if (bestDay && bestMin > 0) {
            const date = new Date(bestDay);
            const dateStr = date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
            this.bestDayText.textContent = `${dateStr} (${bestMin} min)`;
            this.bestDayDateText.textContent = date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' });
        } else {
            this.bestDayText.textContent = '-- (0 min)';
            this.bestDayDateText.textContent = '';
        }

        // 7日間合計
        let weekTotal = 0;
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = this.getDateKey(date);
            
            if (this.dailyMinutes[dateKey]) {
                weekTotal += this.dailyMinutes[dateKey];
            }
        }
        this.weekTotalText.textContent = `${weekTotal} min`;

        // 前週比較
        let prevWeekTotal = 0;
        for (let i = 7; i < 14; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = this.getDateKey(date);
            
            if (this.dailyMinutes[dateKey]) {
                prevWeekTotal += this.dailyMinutes[dateKey];
            }
        }

        if (prevWeekTotal > 0) {
            const diff = weekTotal - prevWeekTotal;
            const percent = Math.round((diff / prevWeekTotal) * 100);
            const sign = percent >= 0 ? '+' : '';
            this.weekCompareText.textContent = `${sign}${percent}% vs prev 7d`;
        } else {
            this.weekCompareText.textContent = '';
        }
    }

    updateWeekBarChart() {
        const ctx = this.weekBarChart.getContext('2d');
        const dpr = window.devicePixelRatio || 1;
        
        const width = this.weekBarChart.offsetWidth || 300;
        const height = this.weekBarChart.offsetHeight || 120;
        
        this.weekBarChart.width = width * dpr;
        this.weekBarChart.height = height * dpr;
        ctx.scale(dpr, dpr);

        const weekData = [];
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const today = new Date();
        const todayDow = (today.getDay() + 6) % 7; // 月曜=0

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i - todayDow);
            const dateKey = this.getDateKey(date);
            weekData.push(this.dailyMinutes[dateKey] || 0);
        }

        const maxMin = Math.max(...weekData, 60);
        this.maxMinText.textContent = `Max: ${maxMin} min / day`;

        const chartWidth = width;
        const chartHeight = height;
        const barWidth = 35;
        const gap = (chartWidth - barWidth * 7) / 8;

        ctx.clearRect(0, 0, chartWidth, chartHeight);

        for (let i = 0; i < 7; i++) {
            const h = weekData[i] > 0 ? (weekData[i] / maxMin) * (chartHeight - 20) : 5;
            const x = gap + i * (barWidth + gap);
            const y = chartHeight - h;

            ctx.fillStyle = '#4A90D9';
            ctx.fillRect(x, y, barWidth, h);
        }

        // ラベル更新
        this.weekLabels.innerHTML = '';
        for (let i = 0; i < 7; i++) {
            const label = document.createElement('div');
            label.textContent = dayNames[i];
            label.style.flex = '1';
            label.style.textAlign = 'center';
            label.style.fontSize = '10px';
            label.style.color = 'rgba(255, 255, 255, 0.7)';
            this.weekLabels.appendChild(label);
        }
    }

    updateRecentSessions() {
        this.recentSessionsList.innerHTML = '';

        const recent = this.sessions
            .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime))
            .slice(0, 5);

        if (recent.length === 0) {
            const item = document.createElement('div');
            item.textContent = 'No sessions yet';
            item.style.color = 'rgba(255, 255, 255, 0.6)';
            item.style.fontSize = '12px';
            this.recentSessionsList.appendChild(item);
            return;
        }

        recent.forEach(session => {
            const item = document.createElement('div');
            item.className = 'session-item';

            const date = new Date(session.dateTime);
            const dateStr = date.toLocaleString('ja-JP', {
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            item.innerHTML = `
                <div class="session-date">${dateStr}</div>
                <div></div>
                <div class="session-duration">${session.durationMinutes} min</div>
                <div class="session-task">${session.taskName || '(Focus)'}</div>
            `;

            this.recentSessionsList.appendChild(item);
        });
    }

    updateDailyDetail() {
        this.dailyDetailList.innerHTML = '';

        // 過去7日間の最大値を計算
        let maxMin = 0;
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = this.getDateKey(date);
            if (this.dailyMinutes[dateKey]) {
                maxMin = Math.max(maxMin, this.dailyMinutes[dateKey]);
            }
        }
        if (maxMin === 0) maxMin = 60;

        // 過去7日間を表示（古い順）
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateKey = this.getDateKey(date);
            const minutes = this.dailyMinutes[dateKey] || 0;

            const item = document.createElement('div');
            item.className = 'daily-item';

            const dateStr = date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' });
            const barWidth = minutes > 0 ? (minutes / maxMin) * 200 : 0;

            item.innerHTML = `
                <div class="daily-date">${dateStr}</div>
                <div class="daily-bar" style="width: ${barWidth}px;"></div>
                <div class="daily-minutes">${minutes} min</div>
            `;

            this.dailyDetailList.appendChild(item);
        }
    }

    saveData() {
        const data = {
            sessions: this.sessions,
            dailyMinutes: this.dailyMinutes
        };
        localStorage.setItem('sessionStats', JSON.stringify(data));
    }

    loadData() {
        const saved = localStorage.getItem('sessionStats');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.sessions = data.sessions || [];
                this.dailyMinutes = data.dailyMinutes || {};
            } catch (e) {
                console.log('Failed to load session stats:', e);
            }
        }
    }
}

// クラス定義のみ（dashboard.htmlで初期化）
