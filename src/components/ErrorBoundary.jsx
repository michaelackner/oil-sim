import { Component } from 'react';

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary]', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '14px', marginBottom: '8px' }}>⚠ Component Error</div>
                        <div style={{ fontSize: '11px' }}>{this.state.error?.message}</div>
                        <button
                            style={{
                                marginTop: '12px',
                                padding: '4px 12px',
                                background: 'var(--bg-panel)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-secondary)',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                            }}
                            onClick={() => this.setState({ hasError: false, error: null })}
                        >
                            Retry
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
