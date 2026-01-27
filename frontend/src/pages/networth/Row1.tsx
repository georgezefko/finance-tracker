import React, { useContext, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import DashboardBox from '../../components/DashboardBox';
import BoxHeader from '../../components/BoxHeader';
import FinancialMetricBox from '../../components/FinancialMetricsBox';
import { AuthContext } from '../../context/AuthContext';
import { apiFetch } from '../../utils/apiFetch';
import { useYear } from '../../context/YearContext'; 
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
} from 'recharts';




interface NetworthSummary {
  currentNetworth: number;
  momChange: number | null;
  momChangePct: number | null;
  ytdChange: number | null;
  ytdChangePct: number | null;
}

interface AllocationRecord {
  month: string;    // '2025-01'
  category: string; // 'Stocks', 'Bonds', etc.
  amount: string;   // numeric string from backend
}

interface AllocationChartItem {
  month: string;
  [key: string]: string | number;
}

const transformAllocationForAbsolute = (
  records: AllocationRecord[]
): AllocationChartItem[] => {
  const map: Record<string, AllocationChartItem> = {};

  records.forEach(({ month, category, amount }) => {
    if (!map[month]) {
      map[month] = { month };
    }
    const current = map[month][category];
    const prev =
      typeof current === 'number'
        ? current
        : parseFloat((current as string) || '0');
    const add = parseFloat(amount) || 0;

    map[month][category] = prev + add;
  });

  return Object.values(map);
};

const Row1: React.FC = () => {
  const authContext = useContext(AuthContext);
  const token = authContext?.token;
  const { year } = useYear(); 
  const [summary, setSummary] = useState<NetworthSummary | null>(null);
  const [allocationAbsolute, setAllocationAbsolute] = useState<AllocationChartItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!token || !authContext) return;

    const fetchSummaryAndAllocation = async () => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authContext.token}`,
      };

      try {
        // 1) Summary
        const response = await apiFetch(
          `/api/networth/summary?year=${year}`,
          { headers },
          authContext
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch networth summary: ${response.status}`);
        }

        const data: NetworthSummary = await response.json();
        setSummary(data);

        // 2) Allocation for selected year
        const allocationResp = await apiFetch(
          `/api/networth/allocation?year=${year}`,
          { headers },
          authContext
        );
        if (!allocationResp.ok) {
          throw new Error(
            `Failed to fetch networth allocation: ${allocationResp.status}`
          );
        }

        const allocationRecords: AllocationRecord[] = await allocationResp.json();

        if (Array.isArray(allocationRecords) && allocationRecords.length > 0) {
          const absData = transformAllocationForAbsolute(allocationRecords);
          setAllocationAbsolute(absData);
        } else {
          setAllocationAbsolute([]);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching networth summary/allocation:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };
// eslint-disable-next-line react-hooks/exhaustive-deps
    fetchSummaryAndAllocation();
  }, [authContext, token, year]);

  if (isLoading) return <div>Loading net worth...</div>;
  if (error) return <div>Error loading net worth.</div>;
  if (!summary) return <div>No net worth data available.</div>;

  const {
    currentNetworth,
    momChange,
    momChangePct,
    ytdChange,
    ytdChangePct,
  } = summary;

  const formatPct = (value: number | null) =>
    value == null ? 0 : Number((value * 100).toFixed(2));

  const now = new Date();
  const updatedLabel = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const totalNetworthPerMonth = allocationAbsolute.map((item) => {
    const { month, ...rest } = item;
    const total = Object.keys(rest).reduce((sum, key) => {
      const value = Number(rest[key] || 0);
      return sum + value;
    }, 0);
    return { month, total };
  });

  return (
    <>
      {/* Box A: Summary metrics */}
      <DashboardBox
        sx={{
          gridArea: 'a',
          display: 'grid',
          gap: '1rem',
          padding: '1rem',
          height: { xs: 220, md: 260 },
          minHeight: { xs: 250, md: 280 },
          width: '100%',
        }}
      >
        <BoxHeader
          title="Net Worth Overview"
          subtitle="Current net worth & performance"
          sideText={`Updated: ${updatedLabel}`}
        />

        <Box
          sx={{
            gridColumn: '1 / -1',
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, 1fr)',
              md: 'repeat(5, 1fr)',
            },
            gap: '1rem',
          }}
        >
          <FinancialMetricBox
            title="Net Worth"
            value={currentNetworth || 0}
            unit="DKK"
            useSignColor
          />
          <FinancialMetricBox
            title="MoM Change"
            value={momChange ?? 0}
            unit="DKK"
            useSignColor
          />
          <FinancialMetricBox
            title="MoM %"
            value={formatPct(momChangePct)}
            unit="%"
            useSignColor
          />
          <FinancialMetricBox
            title="YTD Change"
            value={ytdChange ?? 0}
            unit="DKK"
            useSignColor
          />
          <FinancialMetricBox
            title="YTD %"
            value={formatPct(ytdChangePct)}
            unit="%"
            useSignColor
          />
        </Box>
      </DashboardBox>

      {/* Box B: Net worth total per month (absolute) */}
      <DashboardBox
        sx={{
          gridArea: 'b',
          display: 'grid',
          gap: '0rem',
          padding: '1rem',
          height: '100%', // let it fill its grid area
          minHeight: { xs: 250, md: 320 },
          width: '100%',
        }}
      >
        <BoxHeader
          title="Net Worth Over Time"
          subtitle="Total net worth per month (DKK)"
          sideText={String(year)}
        />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={totalNetworthPerMonth}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barGap={10}
            barCategoryGap={20}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis>
              <Label value="DKK" angle={-90} position="insideLeft" />
            </YAxis>
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #B0BEC5',
                borderRadius: 6,
                color: '#263238',
                fontWeight: 500,
              }}
              labelStyle={{
                color: '#37474F',
                fontWeight: 700,
              }}
              formatter={(value: number) =>
                `${(value as number).toLocaleString()} DKK`
              }
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar
              dataKey="total"
              name="Total Net Worth"
              barSize={25}
              fill="#1976D2"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
};

export default Row1;