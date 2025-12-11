import React from 'react'

export const DashboardIcon = ({className}:{className?:string}) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="8" height="8" rx="1" fill="currentColor" />
    <rect x="13" y="3" width="8" height="5" rx="1" fill="currentColor" opacity="0.9" />
    <rect x="13" y="10" width="8" height="11" rx="1" fill="currentColor" opacity="0.7" />
  </svg>
)

export const MembersIcon = ({className}:{className?:string}) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" fill="currentColor" />
    <path d="M2 20c0-3.31 2.69-6 6-6h8c3.31 0 6 2.69 6 6v1H2v-1z" fill="currentColor" opacity="0.9" />
  </svg>
)

export const UnitsIcon = ({className}:{className?:string}) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9z" fill="currentColor" />
  </svg>
)

export const DebtsIcon = ({className}:{className?:string}) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1v22" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M3 7h18M3 17h18" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export const PaymentsIcon = ({className}:{className?:string}) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" />
    <path d="M7 9h10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
)

export const MenuIcon = ({className}:{className?:string}) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

export default null
