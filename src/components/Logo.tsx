import React from 'react';

interface LogoProps {
  height?: string;
}

const Logo: React.FC<LogoProps> = ({ height = '90px' }) => {
  return (
    <svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg" style={{ height: height, width: 'auto' }}>
      <defs>
        <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#1f2937', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4b5563', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      <g transform="translate(10, 25)">
        <rect x="0" y="25" width="35" height="8" rx="2" fill="#e5e7eb" stroke="#d1d5db" strokeWidth="1"/>
        <rect x="2" y="15" width="35" height="8" rx="2" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="1"/>
        <rect x="4" y="5" width="35" height="8" rx="2" fill="url(#bookGradient)" stroke="#6366f1" strokeWidth="1"/>
        
        <line x1="8" y1="7" x2="8" y2="11" stroke="#ffffff" strokeWidth="1" opacity="0.7"/>
        <line x1="35" y1="7" x2="35" y2="11" stroke="#ffffff" strokeWidth="1" opacity="0.7"/>
        
        <g>
          <rect x="19" y="3" width="6" height="12" fill="#ef4444"/>
          <polygon points="19,15 25,15 22,18" fill="#ef4444"/>
        </g>
      </g>
      
      <g transform="translate(45, 30)">
        <circle cx="15" cy="15" r="12" fill="none" stroke="#e5e7eb" strokeWidth="3"/>
        <circle cx="15" cy="15" r="12" fill="none" stroke="url(#bookGradient)" strokeWidth="3" 
                strokeDasharray="28.27" strokeDashoffset="7" strokeLinecap="round" 
                transform="rotate(-90 15 15)"/>
        
        <path d="M10 15 L13 18 L20 11" stroke="#4f46e5" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </g>
      
      <g transform="translate(85, 25)">
        <text x="0" y="18" fontFamily="'Trebuchet MS', 'Lucida Sans Unicode', sans-serif" fontSize="18" fontWeight="700" fill="url(#textGradient)" letterSpacing="1px">
          CHAPTER
        </text>
        
        <text x="0" y="38" fontFamily="'Trebuchet MS', 'Lucida Sans Unicode', sans-serif" fontSize="18" fontWeight="700" fill="url(#textGradient)" letterSpacing="1px">
          TRACK
        </text>
        
        <line x1="0" y1="25" x2="65" y2="25" stroke="url(#bookGradient)" strokeWidth="1" opacity="0.5"/>
      </g>
    </svg>
  );
};

export default Logo;
