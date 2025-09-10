
import React from 'react';

export const MpesaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    viewBox="0 0 256 186" 
    xmlns="http://www.w3.org/2000/svg" 
    preserveAspectRatio="xMidYMid"
    {...props}
  >
    <defs>
      <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
        <stop stopColor="#44944A" offset="0%"/>
        <stop stopColor="#3A8541" offset="100%"/>
      </linearGradient>
    </defs>
    <path d="M190.584 0 65.416 185.11h64.735l17.43-52.091h64.733L190.584 0z" fill="url(#a)"/>
    <path d="m154.54 80.93-64.733 52.09h64.733l22.464-52.09h-22.464z" fill="#363636"/>
    <path d="m112.913 185.11 64.734-52.091H112.913v52.09z" fill="#E40003"/>
    <path d="M65.416 0 0 185.11h64.734l22.463-66.696L65.416 0z" fill="#484848"/>
  </svg>
);
