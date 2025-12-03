import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {
  const [salary, setSalary] = useState("");
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ category: "", amount: "", paymentMethod: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const token = localStorage.getItem("token");

  // Fetch expenses and salary on component mount
  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [token]);

  const fetchExpenses = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "";
      const res = await axios.get(`${apiUrl}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data);
      
      // Get the most recent salary from expenses
      const salaryData = res.data.find(exp => exp.monthlySalary);
      if (salaryData) {
        setMonthlySalary(salaryData.monthlySalary);
      }
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setError("Failed to load expenses");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSalarySubmit = async (e) => {
    e.preventDefault();
    if (!salary) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "";
      const res = await axios.post(
        `${apiUrl}/expenses`,
        {
          monthlySalary: parseFloat(salary),
          category: "Salary",
          amount: parseFloat(salary),
          paymentMethod: "Direct",
          notes: "Monthly Salary"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Salary added:", res.data);
      setMonthlySalary(parseFloat(salary));
      setSalary("");
      setSuccess("✅ Salary added successfully!");
      fetchExpenses();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error adding salary:", err);
      setError(err.response?.data?.message || "Failed to add salary");
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "";
      const res = await axios.post(
        `${apiUrl}/expenses`,
        {
          ...formData,
          amount: parseFloat(formData.amount),
          date: new Date().toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Expense added:", res.data);
      setFormData({ category: "", amount: "", paymentMethod: "", notes: "" });
      setSuccess("✅ Expense added successfully!");
      fetchExpenses();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error adding expense:", err);
      setError(err.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  const handleEditStart = (expense) => {
    setEditingId(expense._id);
    setEditFormData({
      category: expense.category,
      amount: expense.amount,
      paymentMethod: expense.paymentMethod || "",
      notes: expense.notes || ""
    });
  };

  const handleEditSubmit = async (expenseId) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "";
      const updateData = {
        ...editFormData,
        amount: parseFloat(editFormData.amount)
      };

      if (editFormData.category === "Salary") {
        updateData.monthlySalary = parseFloat(editFormData.amount);
      }

      // Since the backend doesn't have an update endpoint, we'll delete and re-add
      await axios.delete(`${apiUrl}/expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await axios.post(
        `${apiUrl}/expenses`,
        {
          ...updateData,
          date: new Date().toISOString()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingId(null);
      setEditFormData({});
      setSuccess("✅ Transaction updated successfully!");
      fetchExpenses();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating expense:", err);
      setError(err.response?.data?.message || "Failed to update transaction");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "";
      await axios.delete(`${apiUrl}/expenses/${expenseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess("✅ Transaction deleted successfully!");
      fetchExpenses();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error deleting expense:", err);
      setError(err.response?.data?.message || "Failed to delete transaction");
    } finally {
      setLoading(false);
    }
  };

  const totalExpenses = expenses
    .filter(exp => exp.category !== "Salary")
    .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  
  const remainingSalary = monthlySalary - totalExpenses;

  if (!token) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <p>Please <a href="/login">login</a> to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, padding: "0", width: "100%" }}>
      <h1>💰 Dashboard</h1>
      
      {error && <div style={{ 
        padding: '12px', 
        background: '#ffebee', 
        color: '#c62828', 
        borderRadius: '5px', 
        marginBottom: '15px' 
      }}>{error}</div>}
      
      {success && <div style={{ 
        padding: '12px', 
        background: '#e8f5e9', 
        color: '#2e7d32', 
        borderRadius: '5px', 
        marginBottom: '15px' 
      }}>{success}</div>}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px',
        width: '100%'
      }}>
        {/* Add Salary Section */}
        <div style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2>💼 Add Monthly Salary</h2>
          <form onSubmit={handleSalarySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="number"
              placeholder="Monthly Salary (₹)"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
              required
              disabled={loading}
            />
            <button type="submit" style={{
              padding: '10px',
              background: '#2196F3',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }} disabled={loading}>
              {loading ? "Adding..." : "Add Salary"}
            </button>
          </form>
        </div>

        {/* Add Expense Section */}
        <div style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2>➕ Add Expense</h2>
          <form onSubmit={handleExpenseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="text"
              name="category"
              placeholder="Category (Food, Transport...)"
              value={formData.category}
              onChange={handleChange}
              style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
              required
              disabled={loading}
            />
            <input
              type="number"
              name="amount"
              placeholder="Amount (₹)"
              value={formData.amount}
              onChange={handleChange}
              style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
              required
              disabled={loading}
            />
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              style={{
                padding: '8px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                fontSize: '14px'
              }}
              disabled={loading}
            >
              <option value="">Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Card">Card</option>
              <option value="UPI">UPI</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
            <button type="submit" style={{
              padding: '10px',
              background: '#4CAF50',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }} disabled={loading}>
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </form>
        </div>

        {/* Summary Cards */}
        <div style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2>📊 Summary</h2>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ color: '#666', margin: '5px 0' }}>Monthly Salary:</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4CAF50', margin: '0' }}>
              ₹{monthlySalary.toFixed(2)}
            </p>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <p style={{ color: '#666', margin: '5px 0' }}>Total Expenses:</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d32f2f', margin: '0' }}>
              ₹{totalExpenses.toFixed(2)}
            </p>
          </div>
          <div style={{ 
            borderTop: '2px solid #eee', 
            paddingTop: '10px',
            marginTop: '10px'
          }}>
            <p style={{ color: '#666', margin: '5px 0' }}>Remaining:</p>
            <p style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: remainingSalary >= 0 ? '#4CAF50' : '#d32f2f', 
              margin: '0' 
            }}>
              ₹{remainingSalary.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{
        background: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        overflowX: 'auto'
      }}>
        <h2>📋 Recent Transactions</h2>
        {expenses.length === 0 ? (
          <p style={{ color: '#999' }}>No transactions yet. Add salary or expenses to get started!</p>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              minWidth: '600px'
            }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', background: '#f5f5f5' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Amount</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Payment Method</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Notes</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <React.Fragment key={exp._id}>
                    {editingId === exp._id ? (
                      // Edit Row
                      <tr style={{ borderBottom: '1px solid #eee', background: '#fffacd' }}>
                        <td style={{ padding: '12px' }}>
                          <input
                            type="text"
                            name="category"
                            value={editFormData.category}
                            onChange={handleEditChange}
                            style={{
                              padding: '6px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                              width: '100%',
                              boxSizing: 'border-box'
                            }}
                            disabled={loading}
                          />
                        </td>
                        <td style={{ padding: '12px' }}>
                          <input
                            type="number"
                            name="amount"
                            value={editFormData.amount}
                            onChange={handleEditChange}
                            style={{
                              padding: '6px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                              width: '100%',
                              boxSizing: 'border-box'
                            }}
                            disabled={loading}
                          />
                        </td>
                        <td style={{ padding: '12px' }}>
                          <select
                            name="paymentMethod"
                            value={editFormData.paymentMethod}
                            onChange={handleEditChange}
                            style={{
                              padding: '6px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                              width: '100%',
                              boxSizing: 'border-box'
                            }}
                            disabled={loading}
                          >
                            <option value="">Select Method</option>
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                            <option value="UPI">UPI</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <input
                            type="text"
                            name="notes"
                            value={editFormData.notes}
                            onChange={handleEditChange}
                            style={{
                              padding: '6px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                              width: '100%',
                              boxSizing: 'border-box'
                            }}
                            disabled={loading}
                          />
                        </td>
                        <td style={{ padding: '12px' }}>
                          {new Date(exp.date).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleEditSubmit(exp._id)}
                            style={{
                              padding: '6px 12px',
                              background: '#4CAF50',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginRight: '6px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                            disabled={loading}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            style={{
                              padding: '6px 12px',
                              background: '#999',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                            disabled={loading}
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ) : (
                      // View Row
                      <tr style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            display: 'inline-block',
                            padding: '4px 8px',
                            background: exp.category === 'Salary' ? '#e3f2fd' : '#fff3e0',
                            borderRadius: '4px',
                            fontSize: '14px'
                          }}>
                            {exp.category}
                          </span>
                        </td>
                        <td style={{ 
                          padding: '12px', 
                          fontWeight: 'bold',
                          color: exp.category === 'Salary' ? '#4CAF50' : '#d32f2f'
                        }}>
                          {exp.category === 'Salary' ? '+' : '-'}₹{exp.amount}
                        </td>
                        <td style={{ padding: '12px' }}>{exp.paymentMethod || '-'}</td>
                        <td style={{ padding: '12px' }}>{exp.notes || '-'}</td>
                        <td style={{ padding: '12px' }}>
                          {new Date(exp.date).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <button
                            onClick={() => handleEditStart(exp)}
                            style={{
                              padding: '6px 12px',
                              background: '#2196F3',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginRight: '6px',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                            disabled={loading}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => handleDelete(exp._id)}
                            style={{
                              padding: '6px 12px',
                              background: '#f44336',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 'bold'
                            }}
                            disabled={loading}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
