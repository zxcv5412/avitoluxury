'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return this.props.fallback || (
        <div className="bg-[#FAFAFA] border border-[#E8E8EA] rounded-none p-8 my-4 text-center">
          <div className="flex flex-col items-center">
            <FiAlertTriangle className="text-[#0B0B0D] mb-4" size={48} />
            <h2 className="text-xl font-semibold text-[#0B0B0D] uppercase tracking-wider mb-2">Something went wrong</h2>
            <p className="text-[#5A606B] text-sm mb-6 max-w-md">
              {this.state.error?.message || "An unknown error occurred"}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-[#0B0B0D] text-white hover:bg-[#1A1C21] rounded-none transition uppercase tracking-widest text-xs font-semibold"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 