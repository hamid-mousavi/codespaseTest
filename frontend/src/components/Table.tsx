import React from 'react'

type Column<T> = { key: keyof T; title: string }

function Table<T extends Record<string, any>>(props: {columns: Column<T>[]; data: T[]; className?: string}){
  const {columns,data,className} = props
  return (
    <div style={{overflowX:'auto'}}>
      <table className={className} style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={String(c.key)} style={{textAlign:'left',padding:'10px 8px',color:'var(--muted)',fontSize:13}}>{c.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row,idx) => (
            <tr key={idx} style={{borderTop:'1px solid #eef2f6'}}>
              {columns.map(c => (
                <td key={String(c.key)} style={{padding:'10px 8px'}}>{String(row[c.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table
