import DashboardBox from '../../components/DashboardBox';
import React, { useMemo, useEffect, useState, useContext } from 'react';
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
import BoxHeader from '../../components/BoxHeader';
import StateMessage from '../../components/StateMessage';
import { DataGrid, GridToolbar, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Label } from 'recharts';
import { AuthContext } from '../../context/AuthContext';
import { apiFetch } from '../../utils/apiFetch';
import { useYear } from '../../context/YearContext';
import { formatCurrency, formatCompactCurrency, formatMonthTick } from '../../utils/format';
import type { EditableTransaction } from '../../components/ExpenseFormModal';



interface RawDataItem {
    total: string;
    time: string;
    type_name: string;
  }

interface ChartData {
    time: string;
    [key: string]: string | number;
  }

  interface FinancialDetails {
    dates: string;
    category: string;
    amount: string;
}

interface TransformedDataItem {
    month: string;
    [key: string]: string | number;
}


interface TransformedList {
    id: number;
    date: string;
    type: string;
    type_id: number;
    category: string;
    category_id: number;
    amount: number;
}

interface Row2Props {
    onEditTransaction?: (tx: EditableTransaction) => void;
    onChanged?: () => void; // refresh after a delete
}


const transformDataForChart = (financialDetails: FinancialDetails[] ): TransformedDataItem[] => {
    const transformedData: Record<string, TransformedDataItem> = {};

    financialDetails.forEach(({ dates, category, amount }) => {
        const month = dates; // Assuming dates are already in 'YYYY-MM' format
        if (!transformedData[month]) {
            transformedData[month] = { month };
        }
        transformedData[month][category] = (parseFloat(amount) || 0) + (parseFloat(transformedData[month][category] as string) || 0);

    });

    return Object.values(transformedData).sort((a, b) => a.month.localeCompare(b.month));
};

// Function to transform the data
const transformData = (data: RawDataItem[]): ChartData[] => {
    const dataMap: Record<string, ChartData> = {};
  
    data.forEach(item => {
      if (!dataMap[item.time]) {
        dataMap[item.time] = { time: item.time };
      }
      dataMap[item.time][item.type_name] = parseFloat(item.total);
    });
  
    return Object.values(dataMap).sort((a, b) => a.time.localeCompare(b.time));
  };


const barColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']; 
const generateColor = (index: number) => {
   
    return `hsl(${index * 137.508}, 50%, 60%)`; 
};

const Row2: React.FC<Row2Props> = ({ onEditTransaction, onChanged }) => {
    const { palette } = useTheme();
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const { year } = useYear();
    const [stuckData, setStuckData] = useState<TransformedDataItem[]>([]);
    const [listData, setListData] = useState<TransformedList[]>([]);
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [retryKey, setRetryKey] = useState(0);
    const [isolatedCategory, setIsolatedCategory] = useState<string | null>(null);
    const [pendingDelete, setPendingDelete] = useState<TransformedList | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const authContext = useContext(AuthContext);
    const token = authContext?.token;

    const handleEdit = (row: TransformedList) => {
        onEditTransaction?.({
            id: row.id,
            date: row.date,
            amount: Number(row.amount),
            typeId: row.type_id,
            categoryId: row.category_id,
        });
    };

    const confirmDelete = async () => {
        if (!pendingDelete || !authContext) return;
        setDeleting(true);
        try {
            const response = await apiFetch(
                `/api/cashflow/transaction/${pendingDelete.id}`,
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
                throw new Error(data?.message || 'Could not delete the transaction.');
            }
            setPendingDelete(null);
            onChanged?.();
        } catch (err) {
            setDeleteError(err instanceof Error ? err.message : 'Could not delete the transaction.');
            setPendingDelete(null);
        } finally {
            setDeleting(false);
        }
    };

    const columns: GridColDef[] = [
        { field: 'date', headerName: 'Date', width: 100 },
        { field: 'amount', headerName: 'Amount', type: 'number', width: 110, valueFormatter: (params: any) => formatCurrency(Number(params.value)) },
        { field: 'type', headerName: 'Type', width: 100 },
        { field: 'category', headerName: 'Category', width: 140 },
        {
            field: 'actions',
            type: 'actions',
            headerName: '',
            width: 90,
            getActions: (params: any) => [
                <GridActionsCellItem
                    icon={<EditIcon fontSize="small" />}
                    label="Edit"
                    onClick={() => handleEdit(params.row as TransformedList)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon fontSize="small" />}
                    label="Delete"
                    onClick={() => setPendingDelete(params.row as TransformedList)}
                />,
            ],
        },
    ];

    const handleLegendClick = (o: any) => {
        const { dataKey } = o;
        setIsolatedCategory(prev => (prev === dataKey ? null : dataKey));
    };

    useEffect(() => {
        if (!token || !authContext) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authContext.token}`
            };

            try {
                const response = await apiFetch(`/api/cashflow/timeseries?year=${year}`, { headers }, authContext);
                const data: RawDataItem[] = await response.json();
                const transformedData = transformData(data);
                setChartData(transformedData);
                

                const financialResponse = await apiFetch(`/api/cashflow/financial-details?year=${year}`, { headers }, authContext);
                const financialDetails: FinancialDetails[] = await financialResponse.json();
                const transformedChartData = transformDataForChart(financialDetails);
                setStuckData(transformedChartData);


                const tableResponse = await apiFetch(`/api/cashflow/list-expenses?year=${year}`, { headers }, authContext);
                const listExpenses: TransformedList[] = await tableResponse.json();
                // Each row already carries its real DB id (used by the grid and for edit/delete).
                setListData(listExpenses);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching financial data Row 2:', error);
                setError(error instanceof Error ? error : new Error('An unknown error occurred'));
                setLoading(false);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchData();
    }, [authContext, token, year, retryKey]);

    const categoryKeys = useMemo(() => {
        if (chartData.length === 0) return [];
        return Object.keys(chartData[0]).filter(key => key !== 'time');
    }, [chartData]);

    if (isLoading) return <StateMessage variant="loading" message="Loading transactions…" />;
    if (error) return <StateMessage variant="error" title="Couldn't load data" message="Something went wrong loading your transactions." onRetry={() => setRetryKey((k) => k + 1)} />;
    if (!listData.length) return <StateMessage variant="empty" title="No transactions yet" message="Add a transaction with the + button to see your charts and history." />;

    const latestStuckDataMonth = stuckData.length > 0 ? stuckData[stuckData.length - 1].month : '';
    const latestChartDataTime = chartData.length > 0 ? chartData[chartData.length - 1].time : '';

    return (
        <>
        <DashboardBox sx={{ 
                    gridArea: 'd', 
                    display: 'grid',
                    gap: '1rem',
                    padding: '1rem',
                    height: { xs: 250, md: 400 }, // Responsive height
                    width: '100%', }}>
            <BoxHeader title="Expense Types" subtitle="Monthly values of expense types" sideText={`Updated: ${latestStuckDataMonth}`} />
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                  data={stuckData}
                  margin={{
                      top: 20, right: 30, left: 20, bottom: 5,
                  }}
                  barGap={-10}
                  barCategoryGap={0}
                  >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickFormatter={formatMonthTick} tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis tickFormatter={(v) => formatCompactCurrency(Number(v))} width={70}>
                      <Label value="Amount" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
                  </YAxis>
                  <Tooltip formatter={(value: number) => formatCurrency(Number(value))} />
                  <Legend wrapperStyle={{ paddingTop: "10px" }} />
                  {Object.keys(stuckData[0] || {}).filter(key => key !== 'month').map((key, idx) => (
                      <Bar 
                          key={idx} 
                          dataKey={key} 
                          stackId="a" 
                          fill={barColors[idx % barColors.length]} 
                          barSize={30}
                      />
                  ))}
              </BarChart>
            </ResponsiveContainer>
            </DashboardBox>

        <DashboardBox sx={{
            gridArea: 'e',
            display: 'grid',
            gap: '1rem',
            padding: '1rem',
            height: { xs: 250, md: 400 }, // Responsive height
            width: '100%',
        }}>
            <BoxHeader title="Expense Categories" subtitle="Monthly values of expense categories" sideText={`Updated: ${latestChartDataTime}`} />
            <ResponsiveContainer width="100%" height={300}>
            <LineChart
          className="timeSeriesChart"
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          onClick={(e) => e?.activePayload?.[0] && handleLegendClick(e.activePayload[0])}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" tickFormatter={formatMonthTick} tick={{ fontSize: 11 }} interval="preserveStartEnd" />
          <YAxis tickFormatter={(v) => formatCompactCurrency(Number(v))} width={70} />
          <Tooltip formatter={(value: number) => formatCurrency(Number(value))} />
          <Legend onClick={handleLegendClick} wrapperStyle={{ cursor: 'pointer' }} />
          {categoryKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={generateColor(index)}
              hide={isolatedCategory !== null && isolatedCategory !== key}
              strokeWidth={isolatedCategory === key ? 2.5 : 1}
              connectNulls
            />
          ))}
        </LineChart>
        </ResponsiveContainer>
        </DashboardBox>
        <DashboardBox gridArea="f">
                <BoxHeader
                    title="List of Transcactions"
                    sideText={`${listData?.length} Transactions`}
                />
                <Box
                    mt="1rem"
                    p="0 0.5rem"
                    height="80%"
                    sx={{
                        "& .MuiDataGrid-root": {
                            color: palette.grey[300],
                            border: "none",
                        },
                        "& .MuiDataGrid-cell": {
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
                        },
                        "& .MuiDataGrid-columnHeaders": {
                            borderBottom: `1px solid ${palette.grey[800]} !important`,
                        },
                        "& .MuiDataGrid-columnSeparator": {
                            visibility: "hidden",
                        },
                    }}
                >
                    <DataGrid
                        columnHeaderHeight={25}
                        rowHeight={35}
                        hideFooter={true}
                        rows={listData}
                        columns={columns}
                        slots={{ toolbar: GridToolbar }}
                        slotProps={{ toolbar: { showQuickFilter: true, csvOptions: { fileName: 'transactions' } } }}
                    />
                </Box>
            </DashboardBox>

            {/* Delete confirmation */}
            <Dialog
                open={pendingDelete !== null}
                onClose={() => !deleting && setPendingDelete(null)}
            >
                <DialogTitle>Delete transaction?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2">
                        {pendingDelete
                            ? `Delete the ${pendingDelete.category} transaction of ${formatCurrency(
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

export default Row2;
