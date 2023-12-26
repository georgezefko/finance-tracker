import React, { useEffect, useState } from 'react';
import './forecastTable.css'; // Import the CSS file

interface RawDataItem {
    category_name: string;
    type_name: string;
    month: string;
    total_amount: string;
}

interface PivotedData {
    [category: string]: {
        [type: string]: {
            [month: string]: number;
        };
    };
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

    const pivotData = (): PivotedData => {
        let pivotedData: PivotedData = {};
    
        rawData.forEach(({ category_name, type_name, month, total_amount }) => {
            // Trim the month to ensure it matches the months array
            const trimmedMonth = month.trim();
    
            if (!pivotedData[category_name]) {
                pivotedData[category_name] = {};
            }
            if (!pivotedData[category_name][type_name]) {
                pivotedData[category_name][type_name] = months.reduce((acc, m) => ({ ...acc, [m]: 0 }), {});
            }
            if (months.includes(trimmedMonth)) {
                pivotedData[category_name][type_name][trimmedMonth] = parseFloat(total_amount);
            } else {
                console.warn(`Unexpected month format: ${month}`);
            }
        });
        console.log('pivoted',pivotedData)
        return pivotedData;
    };
    

    const formattedData = pivotData();

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
                            <tr className="categoryRow">
                                <td>{category}</td>
                                {months.map(month => <td key={month}></td>)}
                                <td></td> {/* Empty cell for total if needed */}
                            </tr>
                            {Object.entries(types).map(([type, amounts]) => (
                                <tr key={type} className="typeRow">
                                    <td>{type}</td>
                                    {months.map(month => <td key={month}>{amounts[month]}</td>)}
                                    <td>{Object.values(amounts).reduce((a, b) => a + b, 0)}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FinancialForecastTable;
