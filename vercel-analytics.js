// Vercel SpeedInsights と Web Analytics の統合
(function() {
    // Vercel Web Analytics スクリプト
    const analyticsScript = document.createElement('script');
    analyticsScript.src = 'https://cdn.vercel-analytics.com/v1/script.js';
    analyticsScript.async = true;
    analyticsScript.defer = true;
    
    // Vercel SpeedInsights スクリプト
    const speedInsightsScript = document.createElement('script');
    speedInsightsScript.src = 'https://vercel.live/script.js';
    speedInsightsScript.async = true;
    speedInsightsScript.defer = true;
    
    // ドキュメントに追加
    document.head.appendChild(analyticsScript);
    document.head.appendChild(speedInsightsScript);
    
    // カスタムイベント追跡
    // フォーカスセッション完了イベント
    window.addEventListener('sessionCompleted', (e) => {
        if (window.va) {
            window.va.track('SessionCompleted', {
                duration: e.detail.duration,
                timestamp: new Date().toISOString()
            });
        }
    });
    
    // タスク完了イベント
    document.addEventListener('taskCompleted', (e) => {
        if (window.va) {
            window.va.track('TaskCompleted', {
                taskName: e.detail.taskName || 'Unknown',
                timestamp: new Date().toISOString()
            });
        }
    });
    
    // ページビュータッキング
    if (window.va && typeof window.va.track === 'function') {
        window.va.track('PageView', {
            path: window.location.pathname,
            referrer: document.referrer,
            timestamp: new Date().toISOString()
        });
    }
    
    console.log('Vercel Analytics & SpeedInsights initialized');
})();
