import React from 'react';
import { Box, Typography, Button } from '@mui/material';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

// Catches uncaught render errors so a single bad component doesn't blank the
// whole app to a white screen with no way out.
class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Uncaught render error:', error, info);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: 2,
            p: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4">Something went wrong</Typography>
          <Typography variant="body1" sx={{ opacity: 0.7, maxWidth: 420 }}>
            An unexpected error occurred. Reloading the page usually fixes it.
          </Typography>
          <Button variant="contained" onClick={this.handleReload}>
            Reload
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
