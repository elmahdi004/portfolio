import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('UI error:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="grid min-h-screen place-items-center bg-bg px-6 text-center">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink">Something went wrong</h1>
            <p className="mt-2 text-muted">An unexpected error occurred. Try reloading the page.</p>
            <button onClick={() => window.location.reload()} className="btn-primary mt-6">
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
