import React from 'react'

const Layout: React.FC<{ children?: React.ReactNode }>= ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: 220, padding: 16, background: '#f4f6f8' }}>
        <h3>Coop</h3>
        <ul>
          <li><a href="/">Dashboard</a></li>
          <li><a href="/members">Members</a></li>
          <li><a href="/units">Units</a></li>
        </ul>
      </aside>
      <main style={{ padding: 20, flex: 1 }}>{children}</main>
    </div>
  )
}

export default Layout
