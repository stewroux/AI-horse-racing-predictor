
import React from 'react';

interface TrophyIconProps {
  className?: string;
}

const TrophyIcon: React.FC<TrophyIconProps> = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 11l3-3m0 0l3 3m-3-3v8m0-13a9 9 0 110 18 9 9 0 010-18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v2a2 2 0 01-2 2h-2m-14 0H5a2 2 0 01-2-2v-2a2 2 0 012-2h2m10 10v-2a2 2 0 00-2-2h-6a2 2 0 00-2 2v2m10 0h-10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v5m-3-5v5m6-5v5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 21h14" />
  </svg>
);

export default TrophyIcon;
