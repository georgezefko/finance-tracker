import React from 'react';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useYear } from '../context/YearContext';

const YearSelector: React.FC = () => {
  const { year, setYear } = useYear();

  const handleChange = (event: SelectChangeEvent<string>) => {
    const newYear = parseInt(event.target.value as string, 10);
    setYear(newYear);
  };

  // For now, hard-code a few years. Later  can derive from data.
  const years = [2024, 2025, 2026];

  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="year-select-label">Year</InputLabel>
      <Select
        labelId="year-select-label"
        id="year-select"
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