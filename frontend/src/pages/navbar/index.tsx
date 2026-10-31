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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import KeyIcon from '@mui/icons-material/Key';
import YearSelector from '../../components/YearSelector';
import CurrencySelector from '../../components/CurrencySelector';
import { AuthContext } from '../../context/AuthContext';
import { apiFetch, BASE_URL } from '../../utils/apiFetch';

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
  // MCP token is shown once; generating a new one revokes the previous token.
  const [mcpCommand, setMcpCommand] = useState<string | null>(null);
  const [mcpError, setMcpError] = useState<string | null>(null);
  const handleMcpToken = async () => {
    handleCloseMenu();
    setMcpError(null);
    try {
      const response = await apiFetch(
        '/api/auth/mcp-token',
        { method: 'POST', headers: { Authorization: `Bearer ${auth?.token}` } },
        auth
      );
      if (!response.ok) throw new Error('Could not create a token. Please try again.');
      const { token } = await response.json();
      setMcpCommand(
        `claude mcp add --transport http finance ${BASE_URL}/mcp --header "Authorization: Bearer ${token}"`
      );
    } catch (err) {
      setMcpError((err as Error).message);
      setMcpCommand('');
    }
  };

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
        <CurrencySelector />

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
          <MenuItem onClick={handleMcpToken}>
            <ListItemIcon>
              <KeyIcon fontSize="small" />
            </ListItemIcon>
            Connect AI assistant
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        <Dialog open={mcpCommand !== null} onClose={() => setMcpCommand(null)} maxWidth="md">
          <DialogTitle>Connect an AI assistant (MCP)</DialogTitle>
          <DialogContent>
            {mcpError ? (
              <DialogContentText>{mcpError}</DialogContentText>
            ) : (
              <>
                <DialogContentText sx={{ mb: 2 }}>
                  Run this in a terminal to give Claude Code read-only access to your finances.
                  Copy it now, because the token is only shown once. Generating a new one revokes this one.
                </DialogContentText>
                <Box
                  component="pre"
                  sx={{ p: 2, borderRadius: 1, bgcolor: palette.grey[900], color: palette.grey[100], whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                >
                  {mcpCommand}
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions>
            {!mcpError && (
              <Button onClick={() => navigator.clipboard.writeText(mcpCommand ?? '')}>Copy</Button>
            )}
            <Button onClick={() => setMcpCommand(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default Navbar;
