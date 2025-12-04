// Vercel Web Analytics と SpeedInsights の統合
(function() {
    // Vercel Web Analytics スクリプト
    const analyticsScript = document.createElement('script');
    analyticsScript.src = 'https://cdn.vercel-analytics.com/v1/script.js';
    analyticsScript.async = true;
    analyticsScript.defer = true;
    analyticsScript.onload = function() {
        console.log('✓ Vercel Analytics loaded');
    };
    analyticsScript.onerror = function() {
        console.warn('⚠ Vercel Analytics failed to load');
    };
    
    // ドキュメントに追加
    document.head.appendChild(analyticsScript);
    
    // カスタムイベント追跡関数
    function trackEvent(eventName, properties = {}) {
        // Vercel Analytics が利用可能な場合
        if (window.va && typeof window.va.track === 'function') {
            window.va.track(eventName, properties);
            console.log(`📊 Event tracked: ${eventName}`, properties);
        } else {
            // フォールバック: console ログ
            console.log(`📊 Event (not tracked): ${eventName}`, properties);
        }
    }
    
    // グローバルに公開
    window.trackAnalyticsEvent = trackEvent;
    
    // フォーカスセッション完了イベント
    window.addEventListener('sessionCompleted', (e) => {
        trackEvent('SessionCompleted', {
            duration: e.detail.duration,
            timestamp: new Date().toISOString()
        });
    });
    
    // タスク完了イベント
    document.addEventListener('taskCompleted', (e) => {
        trackEvent('TaskCompleted', {
            taskName: e.detail.taskName || 'Unknown',
            timestamp: new Date().toISOString()
        });
    });
    
    // ページビュー追跡
    window.addEventListener('load', () => {
        trackEvent('PageView', {
            path: window.location.pathname,
            referrer: document.referrer || '(direct)',
            timestamp: new Date().toISOString()
        });
    });
    
    console.log('✓ Vercel Analytics integration initialized');
})();

