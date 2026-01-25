import React, { useContext, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import DashboardBox from '../../components/DashboardBox';
import BoxHeader from '../../components/BoxHeader';
import { AuthContext } from '../../context/AuthContext';
import { apiFetch } from '../../utils/apiFetch';
import { useYear } from '../../context/YearContext'; 
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
} from 'recharts';

const baseUrl = process.env.BASE_URL || 'http://localhost:8000';


interface AllocationRecord {
  month: string;    // '2025-01'
  category: string; // 'Stocks', 'Bonds', etc.
  amount: string;   // numeric string from backend
}

interface AllocationChartItem {
  month: string;
  [key: string]: string | number;
}

interface MonthlyMetric {
  month: string;
  networth: number;
  momPct: number | null;
  ytdPct: number | null;
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

const transformAbsoluteToPercent = (
  absoluteData: AllocationChartItem[]
): AllocationChartItem[] => {
  return absoluteData.map((item) => {
    const { month, ...rest } = item;
    const keys = Object.keys(rest);
    const total = keys.reduce(
      (sum, k) => sum + Number(rest[k] || 0),
      0
    );

    const result: AllocationChartItem = { month };

    if (total > 0) {
      keys.forEach((k) => {
        const v = Number(rest[k] || 0);
        result[k] = (v / total) * 100;
      });
    } else {
      keys.forEach((k) => {
        result[k] = 0;
      });
    }

    return result;
  });
};

const allocationColors = [
  '#5C6BC0', // indigo
  '#26A69A', // teal
  '#EF6C00', // orange
  '#8E24AA', // purple
  '#546E7A', // blue-grey
];

const Row2: React.FC = () => {
  const authContext = useContext(AuthContext);
  const { year } = useYear();
  const [metrics, setMetrics] = useState<MonthlyMetric[]>([]);
  const [allocationPercent, setAllocationPercent] = useState<AllocationChartItem[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!authContext?.token) return;

    const fetchMetrics = async () => {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authContext.token}`,
      };

      try {
        const allocationResp = await apiFetch(
          `${baseUrl}/api/networth/allocation?year=${year}`,
          { headers },
          authContext
        );

        if (!allocationResp.ok) {
          throw new Error(
            `Failed to fetch networth allocation: ${allocationResp.status}`
          );
        }

        const allocationRecords: AllocationRecord[] = await allocationResp.json();

        if (!Array.isArray(allocationRecords) || allocationRecords.length === 0) {
          setMetrics([]);
          setAllocationPercent([]);
          setLoading(false);
          return;
        }

        // 1) Aggregate per month (sum across categories)
        const allocationAbsolute = transformAllocationForAbsolute(allocationRecords);

        const totalNetworthPerMonth = allocationAbsolute.map((item) => {
          const { month, ...rest } = item;
          const total = Object.keys(rest).reduce((sum, key) => {
            const value = Number(rest[key] || 0);
            return sum + value;
          }, 0);
          return { month, total };
        });

        // 2) Compute MoM and YTD % for each month
        if (totalNetworthPerMonth.length === 0) {
          setMetrics([]);
          setAllocationPercent([]);
          setLoading(false);
          return;
        }

        const firstNetworth = totalNetworthPerMonth[0].total || 0;

        const monthlyMetrics: MonthlyMetric[] = totalNetworthPerMonth.map(
          (item, index) => {
            const networth = item.total || 0;
            const prev =
              index > 0 ? totalNetworthPerMonth[index - 1].total || 0 : null;

            let momPct: number | null = null;
            if (prev !== null && prev !== 0) {
              momPct = ((networth - prev) / prev) * 100;
            }

            let ytdPct: number | null = null;
            if (firstNetworth !== 0) {
              ytdPct = ((networth - firstNetworth) / firstNetworth) * 100;
            }

            return {
              month: item.month,
              networth,
              momPct,
              ytdPct,
            };
          }
        );

        // 3) Allocation % for stacked bar
        const percentData = transformAbsoluteToPercent(allocationAbsolute);

        setMetrics(monthlyMetrics);
        setAllocationPercent(percentData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching networth time series/allocation:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [authContext?.token, year]);

  if (isLoading) return <div>Loading performance...</div>;
  if (error) return <div>Error loading performance data.</div>;
  if (!metrics.length) return <div>No performance data available.</div>;

  const allocationKeys =
    allocationPercent.length > 0
      ? Object.keys(allocationPercent[0]).filter((k) => k !== 'month')
      : [];

  return (
    <>
      {/* Box C: MoM & YTD time series */}
      <DashboardBox
        sx={{
          gridArea: 'c',
          display: 'grid',
          gap: '0rem',
          padding: '1rem',
          height: { xs: 250, md: 400 },
          width: '100%',
        }}
      >
        <BoxHeader
          title="Net Worth Performance"
          subtitle="MoM and YTD percentage change"
          sideText={String(year)}
        />

        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={metrics}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#CFD8DC" />
            <XAxis
              dataKey="month"
              stroke="#546E7A"
              tickFormatter={(v) => v.slice(5)} // "01", "02", ...
            />
            <YAxis
              stroke="#546E7A"
              tickFormatter={(v) => `${v.toFixed(0)}%`}
              domain={['auto', 'auto']}
            >
              <Label value="%" angle={-90} position="insideLeft" />
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
              formatter={(value: number, name: string) => [
                `${value.toFixed(1)}%`,
                name === 'momPct' ? 'MoM %' : 'YTD %',
              ]}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />

            {/* YTD line */}
            <Line
              type="monotone"
              dataKey="ytdPct"
              name="YTD %"
              stroke="#1976D2"
              strokeWidth={2.5}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls
            />

            {/* MoM line */}
            <Line
              type="monotone"
              dataKey="momPct"
              name="MoM %"
              stroke="#EF6C00"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </DashboardBox>

      {/* Box D: Asset allocation per month (%) stacked */}
      <DashboardBox
        sx={{
          gridArea: 'd',
          display: 'grid',
          gap: '0rem',
          padding: '1rem',
          height: { xs: 250, md: 400 },
          width: '100%',
        }}
      >
        <BoxHeader
          title="Asset Allocation (%)"
          subtitle="Monthly allocation by asset type"
          sideText={String(year)}
        />
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={allocationPercent}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barGap={0}
            barCategoryGap={20}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]}>
              <Label value="%" angle={-90} position="insideLeft" />
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
              formatter={(value: number) => `${value.toFixed(1)}%`}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            {allocationKeys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                barSize={25}
                fill={allocationColors[idx % allocationColors.length]}
              >
                <LabelList
                  dataKey={key}
                  position="center"
                  formatter={(value: number) =>
                    value < 5 ? '' : `${value.toFixed(0)}%`
                  }
                  style={{
                    fill: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: 12,
                    textShadow: '0 1px 6px rgba(0,0,0,0.85)',
                  }}
                />
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </DashboardBox>
    </>
  );
};

export default Row2;