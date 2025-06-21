import React from 'react';
import { Drawer, List, ListItem, ListItemText, useTheme, Box, alpha } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const theme = useTheme();
  const location = useLocation();
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
        
        {/* Add more navigation items here if needed */}
      </List>
    </Drawer>
  );
};

export default Sidebar;
