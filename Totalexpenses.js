import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Totalexpenses() {
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    date: "",
    paymentMethod: "",
    microSaving: "",
    mood: "",
    trigger: "",
    moodAfter: "",
    notes: "",
  });
  const [expenses, setExpenses] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const apiUrl = process.env.REACT_APP_API_URL || "";
    axios
      .get(`${apiUrl}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setExpenses(res.data);
        if (res.data.length > 0) {
          setMonthlySalary(res.data[0].monthlySalary || 0);
        }
      })
      .catch((err) => console.error(err));
  }, [token]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert("Please login first");

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "";
      await axios.post(
        `${apiUrl}/expenses`,
        { ...formData, monthlySalary: Number(monthlySalary) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const payload = {
        Monthly_Salary: Number(monthlySalary),
        Amount: Number(formData.amount),
        Remaining_Salary: Number(monthlySalary) - Number(formData.amount || 0),
        Category: formData.category,
        Payment_Method: formData.paymentMethod,
        Micro_Saving_Option: formData.microSaving || "None",
        Mood: formData.mood || "Neutral",
        Spending_Trigger: formData.trigger || "Impulse",
        Mood_After_Spending: formData.moodAfter || "Neutral",
      };

      const predictionRes = await axios.post(
        "http://localhost:5001/predict",
        payload
      );

      setPrediction(predictionRes.data.prediction);
      setFormData({
        category: "",
        amount: "",
        date: "",
        paymentMethod: "",
        microSaving: "",
        mood: "",
        trigger: "",
        moodAfter: "",
        notes: "",
      });
    } catch (err) {
      console.error("❌ Error adding expense or predicting:", err);
      setPrediction("Prediction failed. Check console.");
    }
  };

  const totalSpent = expenses.reduce(
    (acc, exp) => acc + Number(exp.amount || 0),
    0
  );
  const remainingSalary = Number(monthlySalary) - totalSpent;

  return (
    <div style={styles.page}>
      <motion.div
        style={styles.container}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 style={styles.title}>💰 BudgetBuddy - Expense Tracker</h2>

        <div style={styles.summaryBox}>
          <div>
            <h4>💵 Monthly Salary</h4>
            <input
              type="number"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              placeholder="Enter monthly salary"
              style={styles.salaryInput}
            />
          </div>
          <div>
            <h4>💸 Total Spent</h4>
            <p style={styles.spentText}>₹{totalSpent}</p>
          </div>
          <div>
            <h4>🪙 Remaining</h4>
            <p style={styles.remainingText}>
              ₹{isNaN(remainingSalary) ? 0 : remainingSalary}
            </p>
          </div>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          style={styles.form}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 style={styles.sectionTitle}>Add New Expense</h3>

          <div style={styles.grid}>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Amount"
              style={styles.input}
              required
            />

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Category</option>
              {[
                "Food",
                "Rent",
                "Transport",
                "Shopping",
                "Entertainment",
                "Bills",
                "Others",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              style={styles.input}
              required
            >
              <option value="">Payment Method</option>
              {["UPI", "Cash", "Net Banking", "GPay"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              name="microSaving"
              value={formData.microSaving}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Micro Saving Option</option>
              {["None", "Round-off Savings", "Auto Transfer", "Investment"].map(
                (opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                )
              )}
            </select>

            <select
              name="mood"
              value={formData.mood}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Mood While Spending</option>
              {["Happy", "Sad", "Neutral", "Stressed", "Excited"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <select
              name="trigger"
              value={formData.trigger}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Spending Trigger</option>
              {["Need", "Impulse", "Peer Pressure", "Reward"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              name="moodAfter"
              value={formData.moodAfter}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Mood After Spending</option>
              {["Happy", "Regret", "Neutral"].map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add notes (optional)"
            style={styles.textarea}
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            style={styles.button}
          >
            ➕ Add & Predict
          </motion.button>
        </motion.form>

        {prediction && (
          <motion.div
            style={{
              ...styles.predictionBox,
              background:
                prediction.includes("Save") || prediction.includes("Good")
                  ? "#e8f5e9"
                  : "#ffebee",
              color:
                prediction.includes("Save") || prediction.includes("Good")
                  ? "#2e7d32"
                  : "#c62828",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            🧠 <strong>Recommendation:</strong> {prediction}
          </motion.div>
        )}

        <div style={styles.expenseList}>
          <h3 style={styles.sectionTitle}>📋 Expense History</h3>
          {expenses.length === 0 ? (
            <p style={{ textAlign: "center", color: "#777" }}>
              No expenses added yet.
            </p>
          ) : (
            <ul style={styles.list}>
              {expenses.map((exp, i) => (
                <li key={i} style={styles.listItem}>
                  <div>
                    <strong>{exp.category}</strong> — ₹{exp.amount}
                  </div>
                  <small>
                    {new Date(exp.date).toLocaleDateString()} | {exp.paymentMethod}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  page: {
    background: "linear-gradient(135deg, #f0fdf4 0%, #d9f99d 100%)",
    minHeight: "100vh",
    padding: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "'Inter', sans-serif",
  },
  container: {
    background: "#ffffff",
    borderRadius: "20px",
    padding: "30px 40px",
    width: "100%",
    maxWidth: "650px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  title: {
    textAlign: "center",
    color: "#00796b",
    marginBottom: "25px",
    fontSize: "1.8rem",
    fontWeight: 700,
  },
  summaryBox: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
    textAlign: "center",
    marginBottom: "25px",
    background: "#f7fdfb",
    padding: "15px",
    borderRadius: "12px",
  },
  spentText: { fontSize: "1.2rem", fontWeight: 600, color: "#c62828" },
  remainingText: { fontSize: "1.2rem", fontWeight: 600, color: "#2e7d32" },
  salaryInput: {
    padding: "8px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "100%",
  },
  form: { marginBottom: "25px" },
  sectionTitle: { color: "#004d40", marginBottom: "10px" },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "100%",
    fontSize: "0.95rem",
  },
  textarea: {
    width: "100%",
    minHeight: "60px",
    marginTop: "10px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "0.95rem",
  },
  button: {
    marginTop: "15px",
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    background: "linear-gradient(90deg, #00796b, #26a69a)",
    border: "none",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "1rem",
  },
  predictionBox: {
    textAlign: "center",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    fontWeight: "600",
    marginBottom: "25px",
  },
  expenseList: {
    background: "#f9fafb",
    borderRadius: "12px",
    padding: "15px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    background: "#ffffff",
    padding: "10px 15px",
    borderRadius: "8px",
    marginBottom: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
};

export default Totalexpenses;
