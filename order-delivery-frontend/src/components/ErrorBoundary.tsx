import { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="80vh"
        >
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              maxWidth: 500,
              textAlign: 'center',
              borderLeft: '5px solid #f44336'
            }}
          >
            <Typography variant="h5" color="error" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" paragraph>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
            >
              Go to Home Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
