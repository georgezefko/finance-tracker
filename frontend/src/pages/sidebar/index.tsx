import React, { useContext } from 'react';
import { Drawer, List, ListItem, ListItemText, useTheme, Box, alpha, Divider } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const location = useLocation();
  const auth = useContext(AuthContext);
  const isSelected = (path: string) => location.pathname === path;

  const selectedColor = (path: string) => isSelected(path) ? theme.palette.grey[100] : alpha(theme.palette.grey[100], 0.5);

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      sx={{ 
        '& .MuiDrawer-paper': { backgroundColor: theme.palette.background.default }
      }}
    >
      <List sx={{ width: 250 }} role="presentation" onClick={onClose} onKeyDown={onClose}>
        <Box sx={{ "&:hover": { color: theme.palette.primary[100] }, color: selectedColor('/cashflow') }}>
          <ListItem button component={Link} to="/cashflow" onClick={onClose}>
            <ListItemText primary="Cashflow" />
          </ListItem>
        </Box>
        
        {/* Net Worth */}
        <Box
          sx={{
            '&:hover': { color: theme.palette.primary[100] },
            color: selectedColor('/networth'),
          }}
        >
          <ListItem button component={Link} to="/networth">
            <ListItemText primary="Net Worth" />
          </ListItem>
        </Box>
         {/* Add more navigation items here if needed */}

        <Divider sx={{ my: 1, borderColor: alpha(theme.palette.grey[100], 0.2) }} />

        {/* Logout */}
        <Box
          sx={{
            '&:hover': { color: theme.palette.primary[100] },
            color: alpha(theme.palette.grey[100], 0.5),
          }}
        >
          <ListItem button onClick={() => auth?.logout()}>
            <ListItemText primary="Logout" />
          </ListItem>
        </Box>
      </List>
    </Drawer>
  );
};

export default Sidebar;
