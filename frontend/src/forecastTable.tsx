import React, { useEffect, useState } from 'react';
import './forecastTable.css'; // Import the CSS file

interface RawDataItem {
    category_name: string;
    type_name: string;
    month: string;
    total_amount: string;
}

interface MonthlyAmounts {
    [key: string]: number;
}


interface CategoryData {
    [type: string]: MonthlyAmounts | TotalData | PercentageData;
}

interface TotalData {
    Total: number;
}

interface PercentageData {
    Total: string;  // For percentage values
}

interface PivotedData {
    [category: string]: CategoryData;
}

const FinancialForecastTable = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [rawData, setRawData] = useState<RawDataItem[]>([]);

    useEffect(() => {
        // Replace with your actual API endpoint
        fetch('http://localhost:3000/feed/casflow')
            .then(response => response.json())
            .then(data => {
                console.log('casflow',data)
                setRawData(data)})
            .catch(error => console.error('Error:', error));
    }, []);

    // Type guard to check if the object is a MonthlyAmounts type
const isMonthlyAmounts = (obj: any): obj is { [key: string]: number } => {
    return Object.keys(obj).some(key => months.includes(key));
};

const pivotData = (): PivotedData => {
    let pivotedData: PivotedData = {};

    rawData.forEach(({ category_name, type_name, month, total_amount }) => {
        const trimmedMonth = month.trim();

        if (!pivotedData[category_name]) {
            pivotedData[category_name] = {};
        }
        if (!pivotedData[category_name][type_name]) {
            pivotedData[category_name][type_name] = months.reduce((acc, m) => ({ ...acc, [m]: 0 }), {});
        }
        if (months.includes(trimmedMonth)) {
            const amounts = pivotedData[category_name][type_name];
            if (isMonthlyAmounts(amounts)) {
                amounts[trimmedMonth] = parseFloat(total_amount);
            }
        } else {
            console.warn(`Unexpected month format: ${month}`);
        }
    });

    return pivotedData;
};

    
const calculateTotalsAndPercentages = (data: PivotedData): PivotedData => {
    let revenueTotal: { [month: string]: number } = {};

    // Initialize revenueTotal for each month
    months.forEach(month => { revenueTotal[month] = 0; });

    // Calculate total revenue for each month
    if (data['Income']) {
        Object.entries(data['Income']).forEach(([_, monthlyAmounts]) => {
            months.forEach(month => {
                revenueTotal[month] += (monthlyAmounts as MonthlyAmounts)[month];
            });
        });
    }

    // Calculate total and percentage for each category
    Object.keys(data).forEach(category => {
        months.forEach(month => {
            let monthlyCategoryTotal = 0;

            Object.entries(data[category]).forEach(([type, monthlyAmounts]) => {
                if (type !== 'Total' && type !== 'Percentage of Revenue') {
                    if (typeof monthlyAmounts === 'object' && 'Total' in monthlyAmounts === false) {
                        // Here, we ensure that monthlyAmounts is of the type MonthlyAmounts
                        monthlyCategoryTotal += (monthlyAmounts as MonthlyAmounts)[month];
                    }
                }
            });

            // Update or initialize 'Total' for each category
            if (!data[category]['Total']) {
                data[category]['Total'] = months.reduce((acc, m) => ({ ...acc, [m]: 0 }), {});
            }
            (data[category]['Total'] as MonthlyAmounts)[month] = monthlyCategoryTotal;

            if (category !== 'Income') {
                // Ensure data['Income']['Total'] is of type MonthlyAmounts before accessing it
                const incomeTotal = data['Income'] && 'Total' in data['Income'] && typeof data['Income']['Total'] === 'object' 
                    ? (data['Income']['Total'] as MonthlyAmounts)[month] 
                    : 0;

                const percentageOfRevenue = incomeTotal > 0 ? (monthlyCategoryTotal / incomeTotal) * 100 : 0;
                if (!data[category]['Percentage of Revenue']) {
                    data[category]['Percentage of Revenue'] = {};
                }
                (data[category]['Percentage of Revenue'] as MonthlyAmounts)[month] = percentageOfRevenue;
                }
            });
        });

        return data;
    };
    const formattedData = calculateTotalsAndPercentages(pivotData());

    return (
        <div className="financial-forecast-container">
            <h2>Financial Forecast</h2>
            <table className="financial-forecast-table">
                <thead>
                    <tr>
                        <th>Category / Type</th>
                        {months.map(month => <th key={month}>{month}</th>)}
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(formattedData).map(([category, types]) => (
                        <React.Fragment key={category}>
                            {/* Category Row */}
                            <tr className="categoryRow">
                                <td><b>{category}</b></td>
                                {months.map(month => <td key={month} className="categoryCell" />)}
                                <td />
                            </tr>

                            {/* Type Rows and Total/Percentage Rows */}
                            {Object.entries(types).map(([type, monthlyData]) => {
                                // Explicitly handle Total and Percentage of Revenue rows
                                if (type === 'Total' || type === 'Percentage of Revenue') {
                                    return (
                                        <tr key={type} className={type === 'Total' ? 'totalRow' : 'percentageRow'}>
                                            <td>{type}</td>
                                            {months.map(month => (
                                                <td key={month}>
                                                    {type === 'Total' 
                                                        ? (monthlyData as MonthlyAmounts)[month] 
                                                        : `${((monthlyData as MonthlyAmounts)[month]).toFixed(2)}%`}
                                                </td>
                                            ))}
                                            <td />
                                        </tr>
                                    );
                                }

                                // Handle regular type rows
                                return (
                                    <tr key={type} className="typeRow">
                                        <td>{type}</td>
                                        {months.map(month => (
                                            <td key={month}>{(monthlyData as MonthlyAmounts)[month]}</td>
                                        ))}
                                        <td>{Object.values(monthlyData as MonthlyAmounts).reduce((a, b) => a + b, 0)}</td>
                                    </tr>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
    
} 

export default FinancialForecastTable;
