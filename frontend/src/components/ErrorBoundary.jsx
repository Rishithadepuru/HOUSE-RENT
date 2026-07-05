import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught an error]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '80px auto',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-surface)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <h2 style={{ marginBottom: '16px', color: 'var(--danger)' }}>Something went wrong.</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            {this.state.error?.message || 'An unexpected rendering error occurred inside this section.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Reload Platform
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
