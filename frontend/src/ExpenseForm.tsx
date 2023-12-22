import React, { useState, useEffect } from 'react';
import './ExpenseForm.css'; 


interface Category {
  type_name: string;
  type_id: number;
}

const ExpenseForm = () => {
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);; // Array of categories
  const [selectedCategory, setSelectedCategory] = useState(''); // Selected category

  useEffect(() => {
    // eslint-disable-next-line no-template-curly-in-string
    fetch('http://localhost:3000/feed/expense-categories')
      .then(response => response.json())
      .then(data =>{
        console.log('this is my data',data)
       setCategories(data)})
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  }; 
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  
  const typeId = parseInt(selectedCategory); // Convert to number if necessary

  if (isNaN(typeId)) {
    console.error('Invalid type_id');
    return; // Don't submit if type_id is invalid
  }
  const transactionData = {
    date: new Date().toISOString().slice(0, 10), // Example: current date
    amount: parseFloat(amount),
    typeId: typeId // You need to modify your state to include type_id
  }
  // Send POST request to backend
  fetch('http://localhost:3000/feed/transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactionData),
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error submitting transaction:', error));
  };
  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div>
        <label>Category:</label>
        <select 
          value={selectedCategory} 
          onChange={handleChange}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.type_id} value={category.type_id}>
              {category.type_name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
