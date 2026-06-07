import React, { useContext, useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import YearSelector from '../../components/YearSelector';
import { AuthContext } from '../../context/AuthContext';

type NavbarProps = {
  onToggleSidebar: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { palette } = useTheme();
  const auth = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  const handleLogout = () => {
    handleCloseMenu();
    auth?.logout();
  };

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
        <IconButton onClick={onToggleSidebar} aria-label="Open navigation menu">
          <MenuIcon sx={{ color: 'white' }} />
        </IconButton>
        <Typography variant="h4" fontSize="16px">
          Myfin
        </Typography>
      </Box>

      {/* RIGHT SIDE: year selector + account menu */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <YearSelector />

        <IconButton
          onClick={handleOpenMenu}
          aria-label="Account menu"
          aria-controls={menuOpen ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? 'true' : undefined}
          size="small"
        >
          <AccountCircleIcon sx={{ color: 'white' }} />
        </IconButton>

        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem disabled sx={{ opacity: 1, fontSize: '0.85rem' }}>
            {auth?.email ? `Signed in as ${auth.email}` : 'Signed in'}
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Navbar;
