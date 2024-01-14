import React from 'react';
import { Box, IconButton,  Typography, useTheme,  } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';

// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// import { useDateRange } from '../../components/DateRange'; // Adjust the path as needed

type NavbarProps = {
  onToggleSidebar: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) =>{
  const { palette } = useTheme();
  // const { dateRange, setDateRange } = useDateRange();

  // const handleStartDateChange = (newDate: Date | null) => {
  //   setDateRange({ ...dateRange, startDate: newDate });
  // };

  // const handleEndDateChange = (newDate: Date | null) => {
  //   setDateRange({ ...dateRange, endDate: newDate });
  // };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.5rem',
        color: palette.grey[300]
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={onToggleSidebar}>
          <MenuIcon sx={{ color: 'white' }} />
        </IconButton>
        <Typography variant="h4" fontSize="16px">
          Myfin
        </Typography>
      </Box>

      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <DatePicker
            label="Start Date"
            value={dateRange.startDate}
            onChange={handleStartDateChange}
            renderInput={(params: TextFieldProps) => <TextField {...params} />}
          />
          <DatePicker
            label="End Date"
            value={dateRange.endDate}
            onChange={handleEndDateChange}
            renderInput={(params: TextFieldProps) => <TextField {...params} />}
          />
        </Box>
      </LocalizationProvider> */}
    </Box>
  );
};

export default Navbar;
