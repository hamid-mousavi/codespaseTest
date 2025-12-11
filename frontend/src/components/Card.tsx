import React from 'react'

const Card: React.FC<{children?: React.ReactNode, title?: string, className?:string}> = ({children, title, className}) => {
  return (
    <div className={`card ${className||''}`}>
      {title && <div style={{fontSize:14,color:'var(--muted)',marginBottom:8}}>{title}</div>}
      <div>{children}</div>
    </div>
  )
}

export default Card
