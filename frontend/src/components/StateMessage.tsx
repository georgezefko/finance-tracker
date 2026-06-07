import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import DashboardBox from './DashboardBox';

type StateMessageProps = {
  variant: 'loading' | 'error' | 'empty';
  title?: string;
  message?: string;
  onRetry?: () => void;
};

// A styled, recoverable replacement for the bare <div>Loading…</div> /
// <div>Error…</div> / <div>No data</div> placeholders the dashboards used to
// render. Spans the full grid width so it reads as an intentional state.
const StateMessage: React.FC<StateMessageProps> = ({
  variant,
  title,
  message,
  onRetry,
}) => (
  <DashboardBox
    sx={{
      gridColumn: '1 / -1',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      gap: 1.25,
      p: 3,
      minHeight: 160,
    }}
  >
    {variant === 'loading' && <CircularProgress size={28} />}

    {title && (
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
    )}

    {message && (
      <Typography variant="body2" sx={{ opacity: 0.75, maxWidth: 360 }}>
        {message}
      </Typography>
    )}

    {variant === 'error' && onRetry && (
      <Box sx={{ mt: 1 }}>
        <Button variant="outlined" size="small" onClick={onRetry}>
          Retry
        </Button>
      </Box>
    )}
  </DashboardBox>
);

export default StateMessage;
