import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useYear } from '../context/YearContext';

const YearSelector: React.FC = () => {
  const { year, setYear, years } = useYear();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newYear = parseInt(event.target.value as string, 10);
    setYear(newYear);
  };

  if (!years.length) return null; // nothing if no data yet

  return (
    <FormControl
      size="small"
      variant="outlined"
      sx={{
        minWidth: 110,
        borderRadius: 1,
        // softer than pure white, works on dark navbar
        backgroundColor: 'rgba(255,255,255,0.12)',
        backdropFilter: 'blur(6px)',
        '& .MuiOutlinedInput-root': {
          color: '#FFFFFF',
          '& fieldset': {
            borderColor: 'rgba(255,255,255,0.35)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255,255,255,0.60)',
          },
          '&.Mui-focused fieldset': {
            borderColor: 'rgba(255,255,255,0.85)',
          },
        },
        '& .MuiInputLabel-root': {
          color: 'rgba(255,255,255,0.80)',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#FFFFFF',
        },
        '& .MuiSelect-icon': {
          color: '#FFFFFF',
        },
      }}
    >
      <InputLabel id="year-select-label" shrink>
        Year
      </InputLabel>

      <Select
        labelId="year-select-label"
        value={String(year)}
        label="Year"
        onChange={handleChange}
      >
        {years.map((y) => (
          <MenuItem key={y} value={String(y)}>
            {y}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default YearSelector;