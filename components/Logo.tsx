
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "size-8" }) => {
  return (
    <div className={`${className} relative flex items-center justify-center overflow-visible`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform transition-transform hover:scale-105 duration-300">
        {/* Neural Network Nodes and Connections */}
        <circle cx="50" cy="20" r="4" fill="currentColor" className="text-primary animate-pulse" />
        <circle cx="20" cy="40" r="3" fill="currentColor" className="text-primary opacity-60" />
        <circle cx="80" cy="40" r="3" fill="currentColor" className="text-primary opacity-60" />
        <circle cx="35" cy="15" r="2" fill="currentColor" className="text-primary opacity-40" />
        <circle cx="65" cy="15" r="2" fill="currentColor" className="text-primary opacity-40" />

        {/* Neural Connections (Lines) */}
        <path d="M50 20 L20 40" stroke="currentColor" strokeWidth="1.5" className="text-primary opacity-40" />
        <path d="M50 20 L80 40" stroke="currentColor" strokeWidth="1.5" className="text-primary opacity-40" />
        <path d="M50 20 L35 15" stroke="currentColor" strokeWidth="1" className="text-primary opacity-20" />
        <path d="M50 20 L65 15" stroke="currentColor" strokeWidth="1" className="text-primary opacity-20" />
        
        {/* The Pencil Shape - Integrated with the central node */}
        <g transform="translate(50, 20)">
          {/* Connection from central node to pencil tip */}
          <path d="M0 0 L0 35" stroke="currentColor" strokeWidth="2.5" className="text-primary" strokeLinecap="round" />
          
          {/* Pencil Body */}
          <path d="M-8 35 L8 35 L8 75 L0 85 L-8 75 Z" fill="currentColor" className="text-gray-900 dark:text-white" />
          {/* Pencil Tip Detail */}
          <path d="M-8 75 L8 75 L0 85 Z" fill="currentColor" className="text-gray-400" />
          <path d="M-3 82 L3 82 L0 85 Z" fill="currentColor" className="text-primary" />
          
          {/* Pencil eraser detail */}
          <path d="M-8 35 L8 35 L8 38 L-8 38 Z" fill="currentColor" className="text-pink-400" />
        </g>

        {/* Dynamic sweeping line showing "creation" */}
        <path d="M5 85 Q 30 70, 50 100" stroke="currentColor" strokeWidth="2" className="text-primary opacity-30" strokeDasharray="4 4" fill="none" />
      </svg>
    </div>
  );
};

export default Logo;
