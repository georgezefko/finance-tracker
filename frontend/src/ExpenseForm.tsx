import React, { useState, useEffect } from 'react';
import './ExpenseForm.css';

interface Category {
  type_name: string;
  category_id: number;
  id: number; // Unique identifier for each type
}

const ExpenseForm = () => {
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/feed/expense-categories')
      .then(response => response.json())
      .then(data => {
        console.log('this is my data', data);
        setCategories(data);
      })
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(event.target.value);
    setSelectedTypeId(id);
    // Find and set the corresponding category_id for the selected type
    const category = categories.find(category => category.id === id);
    setSelectedCategoryId(category ? category.category_id : null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedTypeId === null || selectedCategoryId === null) {
      console.error('Type or category not selected');
      return; // Don't submit if either is not selected
    }

    const transactionData = {
      date: new Date().toISOString().slice(0, 10),
      amount: parseFloat(amount),
      typeId: selectedTypeId,
      categoryId: selectedCategoryId
    };

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
        <label>Type:</label>
        <select
          value={selectedTypeId !== null ? selectedTypeId : ''}
          onChange={handleTypeChange}
        >
          <option value="">Select a type</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
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
