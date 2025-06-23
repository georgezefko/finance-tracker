import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Fab
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/apiFetch';

interface Category {
  type_name: string;
  category_id: number;
  id: number;
}

interface ExpenseFormModalProps {
  onExpenseAdded?: () => void; // Callback to refresh data after adding expense
}

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({ onExpenseAdded }) => {
  const baseUrl = process.env.BASE_URL || 'http://localhost:8000';
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetch(`${baseUrl}/feed/expense-categories`)
      .then(response => response.json())
      .then(data => {
        console.log('this is my data', data);
        setCategories(data);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, [baseUrl]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    // Reset form
    setAmount('');
    setSelectedTypeId(null);
    setSelectedCategoryId(null);
  };

  const handleTypeChange = (event: SelectChangeEvent<number>) => {
    const id = parseInt(event.target.value as string);
    setSelectedTypeId(id);
    const category = categories.find(category => category.id === id);
    setSelectedCategoryId(category ? category.category_id : null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedTypeId === null || selectedCategoryId === null) {
      console.error('Type or category not selected');
      return;
    }

    setIsSubmitting(true);

    const transactionData = {
      date: new Date().toISOString().slice(0, 10),
      amount: parseFloat(amount),
      typeId: selectedTypeId,
      categoryId: selectedCategoryId
    };

    try {
      const response = await apiFetch('http://localhost:8000/feed/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authContext?.token}`
        },
        body: JSON.stringify(transactionData),
      }, authContext);
      
      const data = await response.json();
      console.log(data);
      
      // Call callback to refresh data
      if (onExpenseAdded) {
        onExpenseAdded();
      }
      
      handleClose();
    } catch (error) {
      console.error('Error submitting transaction:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add expense"
        onClick={handleOpen}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        <AddIcon />
      </Fab>

      {/* Modal Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">Add Expense</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ marginBottom: theme.spacing(2) }}>
              <TextField
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                variant="outlined"
                label="Amount"
                required
                InputLabelProps={{
                  shrink: true, 
                  style: { color: theme.palette.grey[500] }
                }}
                inputProps={{
                  style: { color: theme.palette.grey[600] }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: theme.palette.grey[400],
                    },
                    '&:hover fieldset': {
                      borderColor: theme.palette.grey[500],
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: theme.spacing(2) }}>
              <InputLabel sx={{ color: theme.palette.grey[500] }}>Type</InputLabel>
              <Select
                value={selectedTypeId !== null ? selectedTypeId : ''}
                onChange={handleTypeChange}
                label="Type"
                required
                sx={{
                  '.MuiSelect-select': { color: theme.palette.grey[600] },
                  'svg': { color: theme.palette.grey[500] },
                }}
              >
                <MenuItem value=""><em>Select a type</em></MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.type_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={isSubmitting || !amount || selectedTypeId === null}
          >
            {isSubmitting ? 'Adding...' : 'Add Expense'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExpenseFormModal; 