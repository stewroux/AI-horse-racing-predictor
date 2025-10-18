import React from 'react';

interface TrophyIconProps {
  className?: string;
}

const TrophyIcon: React.FC<TrophyIconProps> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 01-4.874-1.942 1.5 1.5 0 01-.626-2.035l3-7.5a1.5 1.5 0 012.898 0l.22.55a1.5 1.5 0 012.796 0l.22-.55a1.5 1.5 0 012.898 0l3 7.5a1.5 1.5 0 01-.626 2.035A9.75 9.75 0 0116.5 18.75z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15.75h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75v-3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21.75h7.5" />
    </svg>
);

export default TrophyIcon;