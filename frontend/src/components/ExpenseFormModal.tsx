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
  Fab,
  Snackbar,
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../utils/apiFetch';
import { useYear } from '../context/YearContext';

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

export interface EditableTransaction {
  id: number;
  date: string; // 'YYYY-MM-DD'
  amount: number;
  typeId: number;
  categoryId: number;
  institutionId?: number; // networth only
}

interface ExpenseFormModalProps {
  mode?: 'cashflow' | 'networth';
  onExpenseAdded?: () => void; // Callback to refresh data after adding/updating
  editTransaction?: EditableTransaction | null; // when set, open prefilled in edit mode (cashflow)
  onEditClose?: () => void; // called when an edit dialog closes, so the parent can clear its state
}

const getTodayStr = () => new Date().toISOString().slice(0, 10);

const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  mode = 'cashflow',
  onExpenseAdded,
  editTransaction,
  onEditClose,
}) => {
  
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());
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
  const [formError, setFormError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const authContext = useContext(AuthContext);
  const { year, setYear } = useYear();

  const isEditing = editingId !== null;

  // Decide endpoints based on mode
  const categoriesEndpoint =
    mode === 'cashflow'
      ? `/api/cashflow/expense-categories`
      : `/api/networth/type-institutions`;

  const transactionEndpoint =
    mode === 'cashflow'
      ? `/api/cashflow/transaction`
      : `/api/networth/transactions`;

  const title = isEditing
    ? 'Edit Transaction'
    : mode === 'cashflow'
      ? 'Add Expense'
      : 'Add Net Worth Value';
  const submitLabel = isEditing
    ? 'Save Changes'
    : mode === 'cashflow'
      ? 'Add Expense'
      : 'Add Net Worth';

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

  // Open prefilled when the parent requests an edit (cashflow only).
  useEffect(() => {
    if (!editTransaction) return;
    setAmount(String(editTransaction.amount));
    setSelectedDate(editTransaction.date);
    setSelectedTypeId(editTransaction.typeId);
    setSelectedCategoryId(editTransaction.categoryId);
    setSelectedInstitutionId(editTransaction.institutionId ?? null);
    setEditingId(editTransaction.id);
    setFormError(null);
    setOpen(true);
  }, [editTransaction]);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setAmount('');
    setSelectedDate(getTodayStr());
    setSelectedTypeId(null);
    setSelectedCategoryId(null);
    setSelectedInstitutionId(null);
    setFormError(null);
    if (editingId !== null) {
      setEditingId(null);
      onEditClose?.();
    }
  };

  // When user picks an option:
  // - cashflow: id -> category_id
  // - networth: type_id -> category_id & institution_id
  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const id = parseInt(event.target.value as string, 10);

    if (mode === 'cashflow') {
      // id = cashflow type id
      setSelectedTypeId(id);

      const cashflowCategories = categories as CashflowCategory[];
      const category = cashflowCategories.find((c) => c.id === id);

      setSelectedCategoryId(category ? category.category_id : null);
      setSelectedInstitutionId(null);
    } else {
      // id = networth institution_id
      const options = categories as NetworthTypeInstitutionOption[];
      const opt = options.find((o) => o.institution_id === id);

      if (opt) {
        setSelectedTypeId(opt.type_id);
        setSelectedCategoryId(opt.category_id);
        setSelectedInstitutionId(opt.institution_id);
      } else {
        setSelectedTypeId(null);
        setSelectedCategoryId(null);
        setSelectedInstitutionId(null);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);

    if (selectedTypeId === null || selectedCategoryId === null) {
      setFormError('Please select a type.');
      return;
    }

    if (mode === 'networth' && selectedInstitutionId === null) {
      setFormError('Please select an institution.');
      return;
    }

    setIsSubmitting(true);

    const transactionData: any = {
      date: selectedDate,
      amount: parseFloat(amount),
      typeId: selectedTypeId,
      categoryId: selectedCategoryId,
    };

    if (mode === 'networth') {
      transactionData.institutionId = selectedInstitutionId;
    }

    try {
      const response = await apiFetch(
        isEditing
          ? mode === 'cashflow'
            ? `/api/cashflow/transaction/${editingId}`
            : `/api/networth/transactions/${editingId}`
          : transactionEndpoint,
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authContext?.token}`,
          },
          body: JSON.stringify(transactionData),
        },
        authContext
      );

      const data = await response.json().catch(() => ({}));

      // Only treat a 2xx as success — a validation (422/400) error must NOT
      // close the dialog as if the transaction was saved.
      if (!response.ok) {
        setFormError(
          data?.message || 'Could not save the transaction. Please try again.'
        );
        return;
      }

      setSuccessMsg(
        isEditing
          ? 'Transaction updated'
          : mode === 'cashflow'
            ? 'Transaction added'
            : 'Net worth value added'
      );
      setSuccessOpen(true);

      // If the saved date falls in a different year than the one being viewed,
      // switch to it so the new/edited row stays visible instead of vanishing
      // from the year-scoped dashboard.
      const savedYear = Number(selectedDate.slice(0, 4));
      if (savedYear && savedYear !== year) {
        setYear(savedYear);
      }

      if (onExpenseAdded) {
        onExpenseAdded();
      }

      handleClose();
    } catch (error) {
      // Network / server error (apiFetch surfaces these). Keep the dialog open
      // so the user's input isn't lost.
      setFormError(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      );
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
            {/* Inline error feedback */}
            {formError && (
              <Alert
                severity="error"
                sx={{ mb: 2 }}
                onClose={() => setFormError(null)}
              >
                {formError}
              </Alert>
            )}

            {/* Amount */}
            <FormControl fullWidth sx={{ marginBottom: theme.spacing(2) }}>
              <TextField
                type="number"
                autoFocus
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

            {/* Date — defaults to today but can be backdated */}
            <FormControl fullWidth sx={{ marginBottom: theme.spacing(2) }}>
              <TextField
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                variant="outlined"
                label="Date"
                required
                InputLabelProps={{
                  shrink: true,
                  style: { color: theme.palette.grey[500] },
                }}
                inputProps={{
                  max: getTodayStr(),
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
                value={mode === 'cashflow'
                  ? selectedTypeId !== null
                    ? String(selectedTypeId)
                    : ''
                  : selectedInstitutionId !== null
                    ? String(selectedInstitutionId)
                    : ''}
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
                        key={opt.institution_id}
                        value={opt.institution_id}
                        >
                          {opt.type_name} — {opt.institution_name}
                        </MenuItem>
                      )
                    )}
              </Select>
            </FormControl>

            {/* Hidden submit so pressing Enter in any field submits the form */}
            <button type="submit" style={{ display: 'none' }} aria-hidden="true" tabIndex={-1} />
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

      {/* Success feedback */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {successMsg}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExpenseFormModal;