import { Component } from 'react';

// Catches render-time errors anywhere below it and shows a friendly fallback
// instead of a blank screen. Keeps the app resilient in this mock build.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In a real app this would report to an error service.
    // eslint-disable-next-line no-console
    console.error('VTU Solve caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto flex max-w-md flex-col items-center px-5 py-24 text-center">
          <h1 className="font-heading text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-muted">
            An unexpected error occurred. Reloading the page usually fixes it.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="btn-primary mt-6"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
