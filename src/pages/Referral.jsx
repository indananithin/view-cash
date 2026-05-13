import React, { useState } from 'react';
import { Share2, Copy, CheckCircle, Users } from 'lucide-react';
import './Referral.css';

const Referral = () => {
  const [copied, setCopied] = useState(false);
  const referralCode = 'VIEW50WIN';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join ViewWin',
          text: `Use my referral code ${referralCode} to get 50 bonus coins on ViewWin!`,
          url: 'https://viewwin.app',
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="referral-container page-container">
      <header className="page-header">
        <h2>Refer & Earn</h2>
        <p>Invite friends and earn bonus coins</p>
      </header>

      <div className="referral-hero-card">
        <div className="hero-icon">
          <GiftIcon />
        </div>
        <h3>Get 50 Coins Per Friend</h3>
        <p>When your friend signs up and watches their first ad, you both get 50 coins!</p>
      </div>

      <div className="referral-code-section">
        <p className="code-label">Your Referral Code</p>
        <div className="code-box">
          <span className="code">{referralCode}</span>
          <button className="btn-copy" onClick={handleCopy}>
            {copied ? <CheckCircle size={20} color="#166534" /> : <Copy size={20} />}
          </button>
        </div>
      </div>

      <button className="btn-share" onClick={handleShare}>
        <Share2 size={20} /> Share Link
      </button>

      <div className="referral-stats">
        <h3>Your Referrals</h3>
        <div className="stats-grid">
          <div className="stat-box">
            <Users size={24} className="stat-icon-ref" />
            <div className="stat-content">
              <h4>12</h4>
              <p>Friends Invited</p>
            </div>
          </div>
          <div className="stat-box">
            <div className="stat-icon-ref coin-bg">₹</div>
            <div className="stat-content">
              <h4>600</h4>
              <p>Coins Earned</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GiftIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"></polyline>
    <rect x="2" y="7" width="20" height="5"></rect>
    <line x1="12" y1="22" x2="12" y2="7"></line>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
  </svg>
);

export default Referral;
