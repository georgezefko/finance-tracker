import React, { useContext, useEffect, useState } from 'react';
import {
  useTheme,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Snackbar,
  Alert,
} from '@mui/material';
import DashboardBox from '../../components/DashboardBox';
import BoxHeader from '../../components/BoxHeader';
import StateMessage from '../../components/StateMessage';
import { DataGrid, GridToolbar, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthContext } from '../../context/AuthContext';
import { apiFetch } from '../../utils/apiFetch';
import { useYear } from '../../context/YearContext';
import { formatCurrency } from '../../utils/format';
import type { EditableTransaction } from '../../components/ExpenseFormModal';

interface NetworthRow {
  id: number;
  date: string;
  type: string;
  type_id: number;
  category: string;
  category_id: number;
  institution: string;
  institution_id: number;
  amount: number;
}

interface NetworthTransactionsProps {
  onEditTransaction?: (tx: EditableTransaction) => void;
  onChanged?: () => void; // refresh after a delete
}

const NetworthTransactions: React.FC<NetworthTransactionsProps> = ({
  onEditTransaction,
  onChanged,
}) => {
  const { palette } = useTheme();
  const { year } = useYear();
  const authContext = useContext(AuthContext);
  const token = authContext?.token;

  const [rows, setRows] = useState<NetworthRow[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const [pendingDelete, setPendingDelete] = useState<NetworthRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !authContext) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authContext.token}`,
      };
      try {
        const response = await apiFetch(
          `/api/networth/list-transactions?year=${year}`,
          { headers },
          authContext
        );
        const data: NetworthRow[] = await response.json();
        setRows(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchData();
  }, [authContext, token, year, retryKey]);

  const handleEdit = (row: NetworthRow) => {
    onEditTransaction?.({
      id: row.id,
      date: row.date,
      amount: Number(row.amount),
      typeId: row.type_id,
      categoryId: row.category_id,
      institutionId: row.institution_id,
    });
  };

  const confirmDelete = async () => {
    if (!pendingDelete || !authContext) return;
    setDeleting(true);
    try {
      const response = await apiFetch(
        `/api/networth/transactions/${pendingDelete.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authContext.token}`,
          },
        },
        authContext
      );
      if (!response.ok) {
        if (response.status === 404) {
          // Already gone (e.g. deleted in another tab) — drop it from the grid.
          setPendingDelete(null);
          onChanged?.();
          return;
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data?.message || 'Could not delete the value.');
      }
      setPendingDelete(null);
      onChanged?.();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Could not delete the value.');
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date', width: 100 },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      width: 120,
      valueFormatter: (params: any) => formatCurrency(Number(params.value)),
    },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'institution', headerName: 'Institution', width: 140 },
    { field: 'category', headerName: 'Category', width: 120 },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      width: 90,
      getActions: (params: any) => [
        <GridActionsCellItem
          icon={<EditIcon fontSize="small" />}
          label="Edit"
          onClick={() => handleEdit(params.row as NetworthRow)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon fontSize="small" />}
          label="Delete"
          onClick={() => setPendingDelete(params.row as NetworthRow)}
        />,
      ],
    },
  ];

  if (isLoading) return <StateMessage variant="loading" message="Loading net worth values…" />;
  if (error)
    return (
      <StateMessage
        variant="error"
        title="Couldn't load values"
        message="Something went wrong loading your net worth values."
        onRetry={() => setRetryKey((k) => k + 1)}
      />
    );
  if (!rows.length)
    return (
      <StateMessage
        variant="empty"
        title="No net worth values yet"
        message="Add a net worth value with the + button to see your history."
      />
    );

  return (
    <>
      <DashboardBox width="100%" sx={{ p: '1rem' }}>
        <BoxHeader title="Net Worth Values" sideText={`${rows.length} entries`} />
        <Box
          mt="1rem"
          height={320}
          sx={{
            '& .MuiDataGrid-root': { color: palette.grey[300], border: 'none' },
            '& .MuiDataGrid-cell': {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: `1px solid ${palette.grey[800]} !important`,
            },
            '& .MuiDataGrid-columnSeparator': { visibility: 'hidden' },
          }}
        >
          <DataGrid
            columnHeaderHeight={30}
            rowHeight={35}
            rows={rows}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
            slotProps={{
              toolbar: { showQuickFilter: true, csvOptions: { fileName: 'networth-values' } },
            }}
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          />
        </Box>
      </DashboardBox>

      {/* Delete confirmation */}
      <Dialog open={pendingDelete !== null} onClose={() => !deleting && setPendingDelete(null)}>
        <DialogTitle>Delete net worth value?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            {pendingDelete
              ? `Delete the ${pendingDelete.institution} value of ${formatCurrency(
                  Number(pendingDelete.amount)
                )} on ${pendingDelete.date}? This can't be undone.`
              : ''}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPendingDelete(null)} color="inherit" disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete error feedback */}
      <Snackbar
        open={!!deleteError}
        autoHideDuration={4000}
        onClose={() => setDeleteError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setDeleteError(null)}
          sx={{ width: '100%' }}
        >
          {deleteError}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NetworthTransactions;
