import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, InputLabel, FormControl, Typography} from '@mui/material';
import { useTheme } from '@mui/material/styles'
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { styled } from '@mui/system';

interface Category {
  type_name: string;
  category_id: number;
  id: number; // Unique identifier for each type
}

const ExpenseForm = () => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
  const theme = useTheme();
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${baseUrl}/feed/expense-categories`)
      .then(response => response.json())
      .then(data => {
        console.log('this is my data', data);
        setCategories(data);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, [baseUrl]);

  const handleTypeChange = (event: SelectChangeEvent<number>) => {
    const id = parseInt(event.target.value as string);
    setSelectedTypeId(id);
    const category = categories.find(category => category.id === id);
    setSelectedCategoryId(category ? category.category_id : null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedTypeId === null || selectedCategoryId === null) {
      console.error('Type or category not selected');
      return;
    }

    const transactionData = {
      date: new Date().toISOString().slice(0, 10),
      amount: parseFloat(amount),
      typeId: selectedTypeId,
      categoryId: selectedCategoryId
    };

    fetch('http://localhost:8000/feed/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transactionData),
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error submitting transaction:', error));
  };
  return (
    <Box sx={{
      padding: theme.spacing(3),
      backgroundColor: theme.palette.background.default,
      borderRadius: theme.shape.borderRadius,
      boxShadow: theme.shadows[1],
      maxWidth: '200px', // Adjust the width as needed
      //margin: 'auto', // Center the form
      border: '2px solid lightgray',
      textAlign: 'center',
      margin: theme.spacing(5, )
  }}>
      <Typography variant="h3" sx={{ marginBottom: theme.spacing(2) } }>Add Expense</Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth sx={{ marginBottom: theme.spacing(2), border: `2px solid ${theme.palette.grey[300]}` }}>
        <TextField
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          variant="outlined"
          label="Amount"
          InputLabelProps={{
            shrink: true, 
            style: { color: theme.palette.grey[500] } // Color for the label
          }}
          inputProps={{
            style: { color: theme.palette.grey[600] } // Color for the input text
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: theme.palette.grey[400], // Color for the border
              },
              '&:hover fieldset': {
                borderColor: theme.palette.grey[500], // Color on hover
              },
              '&.Mui-focused fieldset': {
                borderColor: theme.palette.primary.main, // Color when focused
              },
            },
          }}
        />
      </FormControl>

      <FormControl fullWidth sx={{ marginBottom: theme.spacing(2), border: `2px solid ${theme.palette.grey[300]}` }}>
        <InputLabel sx={{ color: theme.palette.grey[500] }}>Type</InputLabel> {/* Color for the label */}
        <Select
          value={selectedTypeId !== null ? selectedTypeId : ''}
          onChange={handleTypeChange}
          label="Type"
          sx={{
            '.MuiSelect-select': { color: theme.palette.grey[600] }, // Color for the select text
            'svg': { color: theme.palette.grey[500] }, // Color for the dropdown icon
          }}
        >
          <MenuItem value=""><em>None</em></MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.id}>{category.type_name}</MenuItem>
          ))}
        </Select>
      </FormControl>
        <Button type="submit" variant="contained" color="primary">Add Expense</Button>
      </form>
    </Box>
  );
};

export default ExpenseForm;
