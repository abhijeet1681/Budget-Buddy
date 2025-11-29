import React from "react";

function Home() {
  return (
    <section style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      background: '#f6f9fc',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
        maxWidth: '900px',
        marginBottom: '50px'
      }}>
        <div style={{ maxWidth: '50%' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#2c3e50',
          }}>
            Take Control of Your Finances with BudgetBuddy
          </h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            color: '#555',
            lineHeight: '1.5'
          }}>
            Track your expenses, save smartly, and achieve your financial goals with ease.
          </p>
          <a href="/dashboard" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '12px 32px',
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#fff',
              background: '#4e8cff',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(78, 140, 255, 0.5)',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#3a69d8'}
            onMouseLeave={e => e.currentTarget.style.background = '#4e8cff'}>
              Get Started →
            </button>
          </a>
        </div>
        <div>
          <svg width="180" height="120" viewBox="0 0 180 120" aria-label="Finance chart illustration">
            <rect x="20" y="60" width="30" height="40" fill="#4e8cff" />
            <rect x="60" y="40" width="30" height="60" fill="#6ad786" />
            <rect x="100" y="30" width="30" height="70" fill="#ffba56" />
            <ellipse cx="140" cy="90" rx="20" ry="15" fill="#ffd700" />
          </svg>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        maxWidth: '900px',
        textAlign: 'center',
        gap: '30px',
        flexWrap: 'wrap'
      }}>
        {[
          { icon: '📊', title: 'Track Expenses', description: 'Monitor where your money goes.' },
          { icon: '💰', title: 'Plan Savings', description: 'Set monthly savings goals.' },
          { icon: '🔔', title: 'Smart Alerts', description: 'Get reminders & spending insights.' },
          { icon: '📈', title: 'Visual Reports', description: 'Understand your finances with charts.' }
        ].map(({ icon, title, description }) => (
          <div key={title} style={{
            flex: '1 1 180px',
            background: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s ease',
            cursor: 'default'
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{
              fontSize: '2.5rem',
              marginBottom: '15px'
            }}>{icon}</div>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '700',
              marginBottom: '10px',
              color: '#34495e'
            }}>{title}</h3>
            <p style={{ color: '#666', fontSize: '1rem', lineHeight: '1.4' }}>
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Home;
