import React, { useState, useEffect } from 'react';
import './ExpenseForm.css'; 


interface Category {
  category_name: string;
}

const ExpenseForm = () => {
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);; // Array of categories
  const [selectedCategory, setSelectedCategory] = useState(''); // Selected category

  useEffect(() => {
    fetch('http://localhost:3000/feed/expense-categories')
      .then(response => response.json())
      .then(data =>{
        console.log('this is my data',data)
       setCategories(data)})
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ amount, selectedCategory });
    // TODO: Handle form submission
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
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((category, index) => (
            <option key={index} value={category.category_name}>
              {category.category_name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Add Expense</button>
    </form>
  );
};

export default ExpenseForm;
