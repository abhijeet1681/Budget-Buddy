import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} BudgetBuddy. All Rights Reserved.</p>
        <p>
          Created by <strong>Abhijeet Jadhav</strong>
        </p>
        <p>
          📧{" "}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=abhijeet9274@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            abhijeet9274@gmail.com
          </a>{" "}
          | 📞{" "}
          <a href="tel:+919833525518">+91 98335 25518</a>
        </p>
        <div className="hashtags">
          <span>#SmartBudgeting</span>
          <span>#TrackAndSave</span>
          <span>#BudgetBuddy</span>
          <span>#FinancialFreedom</span>
          <span>#FutureRecommendations</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
