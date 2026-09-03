import React from 'react';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { useCurrency } from '../context/CurrencyContext';
import { CURRENCIES, Currency } from '../utils/format';

const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  const handleChange = (event: SelectChangeEvent<string>) => {
    setCurrency(event.target.value as Currency);
  };

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
      <InputLabel id="currency-select-label" shrink>
        Currency
      </InputLabel>

      <Select
        labelId="currency-select-label"
        value={currency}
        label="Currency"
        onChange={handleChange}
      >
        {CURRENCIES.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CurrencySelector;
