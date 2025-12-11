import React from 'react'

export default function Dashboard(){
  return (
    <div>
      <div className="card-grid">
        <div className="card">
          <div className="label">Total Members</div>
          <div className="value">128</div>
        </div>
        <div className="card">
          <div className="label">Outstanding Debts</div>
          <div className="value">42</div>
        </div>
        <div className="card">
          <div className="label">Payments This Month</div>
          <div className="value">1,024</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{margin:0}}>Recent Activity</h3>
        <div style={{marginTop:12,color:'var(--muted)'}}>No recent activity to show — replace with real data from the API.</div>
      </div>
    </div>
  )
}
