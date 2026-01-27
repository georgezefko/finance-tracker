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

interface CashflowCategory {
  type_name: string;
  category_id: number;
  id: number;
}

interface NetworthTypeInstitutionOption {
  type_id: number;
  category_id: number;
  type_name: string;
  institution_id: number;
  institution_name: string;
}

interface ExpenseFormModalProps {
  mode?: 'cashflow' | 'networth';
  onExpenseAdded?: () => void; // Callback to refresh data after adding expense
}

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  mode = 'cashflow',
  onExpenseAdded,
}) => {
  
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState<
    CashflowCategory[] | NetworthTypeInstitutionOption[]
  >([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<
    number | null
  >(null); // used only for networth
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authContext = useContext(AuthContext);

  // Decide endpoints based on mode
  const categoriesEndpoint =
    mode === 'cashflow'
      ? `/api/cashflow/expense-categories`
      : `/api/networth/type-institutions`;

  const transactionEndpoint =
    mode === 'cashflow'
      ? `/api/cashflow/transaction`
      : `/api/networth/transactions`;

  const title = mode === 'cashflow' ? 'Add Expense' : 'Add Net Worth Value';
  const submitLabel = mode === 'cashflow' ? 'Add Expense' : 'Add Net Worth';

  // Fetch categories (for cashflow) or type+institution options (for networth)
  useEffect(() => {
    if (!authContext?.token) return;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authContext.token}`,
    };

    const fetchCategories = async () => {
      try {
        const response = await apiFetch(
          categoriesEndpoint,
          { headers },
          authContext
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories/options:', error);
      }
    };

    fetchCategories();
  }, [categoriesEndpoint, authContext]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setAmount('');
    setSelectedTypeId(null);
    setSelectedCategoryId(null);
    setSelectedInstitutionId(null);
  };

  // When user picks an option:
  // - cashflow: id -> category_id
  // - networth: type_id -> category_id & institution_id
  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const id = parseInt(event.target.value as string, 10);
    setSelectedTypeId(id);

    if (mode === 'cashflow') {
      const cashflowCategories = categories as CashflowCategory[];
      const category = cashflowCategories.find((c) => c.id === id);
      setSelectedCategoryId(category ? category.category_id : null);
      setSelectedInstitutionId(null);
    } else {
      const options = categories as NetworthTypeInstitutionOption[];
      const opt = options.find((o) => o.type_id === id);
      if (opt) {
        setSelectedCategoryId(opt.category_id);
        setSelectedInstitutionId(opt.institution_id);
      } else {
        setSelectedCategoryId(null);
        setSelectedInstitutionId(null);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedTypeId === null || selectedCategoryId === null) {
      console.error('Type or category not selected');
      return;
    }

    if (mode === 'networth' && selectedInstitutionId === null) {
      console.error('Institution not selected for networth');
      return;
    }

    setIsSubmitting(true);

    const transactionData: any = {
      date: new Date().toISOString().slice(0, 10),
      amount: parseFloat(amount),
      typeId: selectedTypeId,
      categoryId: selectedCategoryId,
    };

    if (mode === 'networth') {
      transactionData.institutionId = selectedInstitutionId;
    }

    try {
      const response = await apiFetch(
        transactionEndpoint,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authContext?.token}`,
          },
          body: JSON.stringify(transactionData),
        },
        authContext
      );

      const data = await response.json();
      console.log('Transaction response:', data);

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
        aria-label={mode === 'cashflow' ? 'add expense' : 'add networth'}
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
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5">{title}</Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {/* Amount */}
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
                  style: { color: theme.palette.grey[500] },
                }}
                inputProps={{
                  style: { color: theme.palette.grey[600] },
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

            {/* Type (or Type + Institution combined for networth) */}
            <FormControl fullWidth sx={{ marginBottom: theme.spacing(2) }}>
              <InputLabel sx={{ color: theme.palette.grey[500] }}>
                {mode === 'cashflow' ? 'Type' : 'Type / Institution'}
              </InputLabel>
              <Select
                value={selectedTypeId !== null ? String(selectedTypeId) : ''}
                onChange={handleTypeChange}
                label={mode === 'cashflow' ? 'Type' : 'Type / Institution'}
                required
                sx={{
                  '.MuiSelect-select': { color: theme.palette.grey[600] },
                  svg: { color: theme.palette.grey[500] },
                }}
              >
                <MenuItem value="">
                  <em>
                    {mode === 'cashflow'
                      ? 'Select a type'
                      : 'Select type / institution'}
                  </em>
                </MenuItem>

                {mode === 'cashflow'
                  ? (categories as CashflowCategory[]).map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.type_name}
                      </MenuItem>
                    ))
                  : (categories as NetworthTypeInstitutionOption[]).map(
                      (opt) => (
                        <MenuItem
                          key={`${opt.type_id}-${opt.institution_id}`}
                          value={opt.type_id}
                        >
                          {opt.type_name} — {opt.institution_name}
                        </MenuItem>
                      )
                    )}
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
            disabled={
              isSubmitting ||
              !amount ||
              selectedTypeId === null ||
              selectedCategoryId === null ||
              (mode === 'networth' && selectedInstitutionId === null)
            }
          >
            {isSubmitting ? 'Adding...' : submitLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ExpenseFormModal;