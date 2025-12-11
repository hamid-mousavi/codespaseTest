import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { DashboardIcon, MembersIcon, UnitsIcon, DebtsIcon, PaymentsIcon, MenuIcon } from './Icons'

const Layout: React.FC<{ children?: React.ReactNode }>= ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className={`app-layout ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div className="logo">Coop</div>
          <button className={`toggle-btn ${collapsed ? 'rotated' : ''}`} onClick={() => setCollapsed(s => !s)} aria-label="Toggle sidebar">
            <MenuIcon />
          </button>
        </div>
        <nav>
          <ul className="nav">
            <li><NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}><DashboardIcon/>Dashboard</NavLink></li>
            <li><NavLink to="/members" className={({isActive}) => isActive ? 'active' : ''}><MembersIcon/>Members</NavLink></li>
            <li><NavLink to="/units" className={({isActive}) => isActive ? 'active' : ''}><UnitsIcon/>Units</NavLink></li>
            <li><NavLink to="/debts" className={({isActive}) => isActive ? 'active' : ''}><DebtsIcon/>Debts</NavLink></li>
            <li><NavLink to="/payments" className={({isActive}) => isActive ? 'active' : ''}><PaymentsIcon/>Payments</NavLink></li>
          </ul>
        </nav>
      </aside>
      <main className="main">
        <div className="header">
          <div className="title">Cooperative Dashboard</div>
        </div>
        {children}
      </main>
    </div>
  )
}

export default Layout
