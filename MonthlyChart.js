// src/pages/MonthlyChart.js
import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function MonthlyChart() {
  const [expenses, setExpenses] = useState([]);
  const [latestSalary, setLatestSalary] = useState(0);

  // Fetch expenses dynamically
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first.");
      return;
    }

    const fetchExpenses = () => {
      const apiUrl = process.env.REACT_APP_API_URL || "";
      axios
        .get(`${apiUrl}/expenses`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data = res.data || [];
          setExpenses(data);

          // Latest salary from newest expense
          const lastSalary = Number(data[0]?.monthlySalary) || 0;
          setLatestSalary(lastSalary);
        })
        .catch((err) => {
          if (err.response) {
            console.error("Error fetching expenses:", err.response.status, err.response.data);
          } else {
            console.error("Error fetching expenses:", err.message);
          }
        });
    };

    fetchExpenses(); // initial fetch
    const interval = setInterval(fetchExpenses, 5000); // auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  // Group expenses by month/year
  const dataMap = {};
  expenses.forEach((exp) => {
    const dateObj = new Date(exp.date);
    const monthYear = dateObj.toLocaleString("default", { month: "short", year: "2-digit" });
    dataMap[monthYear] = (dataMap[monthYear] || 0) + Number(exp.amount);
  });

  // Sort months chronologically
  const sortedMonths = Object.keys(dataMap).sort((a, b) => {
    const [ma, ya] = a.split(" ");
    const [mb, yb] = b.split(" ");
    return new Date(`01 ${ma} 20${ya}`) - new Date(`01 ${mb} 20${yb}`);
  });

  // Keep last 12 months
  const chartData = sortedMonths.slice(-12).map((month) => ({
    month,
    Salary: latestSalary,
    Expenses: dataMap[month],
    Remaining: latestSalary - dataMap[month],
  }));

  return (
    <div className="monthly-chart-page" style={{ display: "flex" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          padding: "30px",
          background: "#f4f6f9",
          minHeight: "100vh",
        }}
      >
        <h2 style={{ marginBottom: "20px", color: "#333", fontSize: "1.8rem" }}>
          12-Month Expense Overview
        </h2>
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            minHeight: "420px",
          }}
        >
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#555", fontSize: 14 }}
                  axisLine={{ stroke: "#ccc" }}
                  tickLine={{ stroke: "#ccc" }}
                />
                <YAxis
                  tick={{ fill: "#555", fontSize: 14 }}
                  axisLine={{ stroke: "#ccc" }}
                  tickLine={{ stroke: "#ccc" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    borderColor: "#ddd",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "14px", fontWeight: "500" }}
                />
                <Bar dataKey="Salary" fill="#82ca9d" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Expenses" fill="#8884d8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Remaining" fill="#ffc658" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p style={{ color: "#777", fontSize: "1rem" }}>
              No expense data available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MonthlyChart;
