import { useEffect, useRef } from 'react';
import useGameStore from '../state/gameStore.js';

export default function NewsFeed() {
    const newsItems = useGameStore(s => s.newsItems);
    const feedRef = useRef(null);

    // Auto-scroll to bottom when new items arrive
    useEffect(() => {
        if (feedRef.current) {
            feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
    }, [newsItems]);

    const getCategoryClass = (item) => {
        if (item.isNoise) return 'noise';
        if (item.category === 'system') return 'system';
        if (item.impact) {
            return item.impact.direction > 0 ? 'bullish' : 'bearish';
        }
        return '';
    };

    return (
        <div className="panel">
            <div className="panel-header">
                <span className="panel-title">News Feed</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {newsItems.length} items
                </span>
            </div>
            <div className="news-feed" ref={feedRef}>
                {newsItems.map((item, i) => (
                    <div key={i} className={`news-item ${getCategoryClass(item)}`}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                            <span className="news-time">{item.timestamp}</span>
                            <span className={`news-category ${item.category}`}>{item.category}</span>
                        </div>
                        <div className="news-headline">{item.headline}</div>
                        {item.detail && <div className="news-detail">{item.detail}</div>}
                    </div>
                ))}
            </div>
        </div>
    );
}
