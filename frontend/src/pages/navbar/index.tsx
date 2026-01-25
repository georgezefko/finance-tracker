import React from 'react';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import YearSelector from '../../components/YearSelector';

type NavbarProps = {
  onToggleSidebar: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { palette } = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem 1rem',
        color: palette.grey[300],
      }}
    >
      {/* LEFT SIDE: menu + logo */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <IconButton onClick={onToggleSidebar}>
          <MenuIcon sx={{ color: 'white' }} />
        </IconButton>
        <Typography variant="h4" fontSize="16px">
          Myfin
        </Typography>
      </Box>

      {/* RIGHT SIDE: year selector */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <YearSelector />
      </Box>
    </Box>
  );
};

export default Navbar;