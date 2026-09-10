import React from 'react';

const Logo = ({ size = 40, showText = true, className = '', whiteText = false }) => {
  return (
    <div className={`logo-container ${className} ${whiteText ? 'logo-white-text' : ''}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="logo-icon"
      >
        {/* Background circle with gradient */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#0d9488', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0f766e', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Main circle */}
        <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
        
        {/* Wallet shape */}
        <rect x="10" y="14" width="20" height="14" rx="2" fill="white" fillOpacity="0.9" />
        <rect x="10" y="14" width="20" height="4" rx="2" fill="white" fillOpacity="0.7" />
        
        {/* Coin/wallet details */}
        <circle cx="20" cy="21" r="3" fill="#0d9488" />
        <circle cx="20" cy="21" r="1.5" fill="white" />
        
        {/* Small accent dots */}
        <circle cx="14" cy="21" r="1" fill="#0d9488" fillOpacity="0.6" />
        <circle cx="26" cy="21" r="1" fill="#0d9488" fillOpacity="0.6" />
      </svg>
      
      {showText && (
        <div className="logo-text">
          <span className="logo-name">Spendly</span>
          <span className="logo-tagline">Track. Save. Spend Smart.</span>
        </div>
      )}
    </div>
  );
};

export default Logo;