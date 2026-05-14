import React, { useState } from 'react';
import { Users, Gift, IndianRupee, Bell, Shield, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import './Admin.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const MOCK_STATS = [
    { label: 'Total Users', value: '1,245', icon: <Users /> },
    { label: 'Active Products', value: '8', icon: <Gift /> },
    { label: 'Pending Payouts', value: '₹12,450', icon: <IndianRupee /> },
    { label: 'Fake Users Banned', value: '42', icon: <Shield /> }
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <div className="admin-grid">
            {MOCK_STATS.map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div>
                  <p>{stat.label}</p>
                  <h3>{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>
        );
      case 'withdrawals':
        return (
          <div className="admin-table-container">
            <h3>Pending Withdrawals</h3>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Amount</th>
                  <th>UPI ID</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Rohan S.</td>
                  <td>500 Coins</td>
                  <td>rohan@upi</td>
                  <td className="action-cell">
                    <button className="btn-approve"><CheckCircle size={16}/></button>
                    <button className="btn-reject"><XCircle size={16}/></button>
                  </td>
                </tr>
                <tr>
                  <td>Priya K.</td>
                  <td>1200 Coins</td>
                  <td>priya@oksbi</td>
                  <td className="action-cell">
                    <button className="btn-approve"><CheckCircle size={16}/></button>
                    <button className="btn-reject"><XCircle size={16}/></button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        );
      case 'users':
        return (
          <div className="admin-list-container">
            <h3>Manage Users</h3>
            <div className="user-item">
              <div>
                <strong>device123_abc</strong>
                <p>Nithin • 120 Coins</p>
              </div>
              <button className="btn-ban">Ban Device</button>
            </div>
            <div className="user-item suspicious">
              <div>
                <strong>device999_xyz</strong> <span className="warning-badge">Multiple Accounts</span>
                <p>FakeUser1 • 5000 Coins</p>
              </div>
              <button className="btn-ban">Ban Device</button>
            </div>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="admin-page page-container">
      <header className="admin-header">
        <h2>Admin Panel</h2>
        <p>Manage ViewCash platform</p>
      </header>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''} 
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={16} /> Overview
        </button>
        <button 
          className={activeTab === 'withdrawals' ? 'active' : ''} 
          onClick={() => setActiveTab('withdrawals')}
        >
          <IndianRupee size={16} /> Withdrawals
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => setActiveTab('users')}
        >
          <Shield size={16} /> Users
        </button>
      </div>

      <div className="admin-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
