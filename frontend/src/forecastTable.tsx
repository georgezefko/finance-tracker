import React from 'react';

const FinancialForecastTable = () => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const categories = ["Salary (After Tax)", "Bonuses (After Tax)", "Other Job-Related (Feriepenge, etc.)", "Total Day Job", "Real Estate Income", "Other Income", "TOTAL NET REVENUE", /* ... more categories ... */];

    return (
        <div>
            <h2>Financial Forecast</h2>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        {months.map(month => <th key={month}>{month}</th>)}
                        <th>Total</th>
                        <th>Average</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map(category => (
                        <tr key={category}>
                            <td>{category}</td>
                            {months.map(month => <td key={month}>-</td>)}
                            <td>-</td>
                            <td>-</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default FinancialForecastTable;
