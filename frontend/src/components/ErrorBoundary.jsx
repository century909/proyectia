import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__content">
            <div className="error-boundary__icon">⚠️</div>
            <h2 className="error-boundary__title">Algo salió mal</h2>
            <p className="error-boundary__message">
              Ocurrió un error inesperado. Por favor, intenta recargar la página.
            </p>
            <div className="error-boundary__actions">
              <button 
                className="error-boundary__retry-btn"
                onClick={this.handleRetry}
              >
                Intentar de nuevo
              </button>
              <button 
                className="error-boundary__reload-btn"
                onClick={() => window.location.reload()}
              >
                Recargar página
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary__details">
                <summary>Detalles del error (desarrollo)</summary>
                <pre className="error-boundary__error-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

