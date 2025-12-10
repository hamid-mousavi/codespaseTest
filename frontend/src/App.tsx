import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Units from './pages/Units'
import Debts from './pages/Debts'
import Payments from './pages/Payments'
import MemberPortal from './pages/MemberPortal'
import RequireAuth from './components/RequireAuth'

export default function App(){
  return (
    <div>
      <nav>
        <Link to="/">Dashboard</Link> | <Link to="/members">Members</Link> | <Link to="/units">Units</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<RequireAuth><Dashboard/></RequireAuth>} />
        <Route path="/members" element={<RequireAuth><Members/></RequireAuth>} />
        <Route path="/units" element={<RequireAuth><Units/></RequireAuth>} />
        <Route path="/debts" element={<RequireAuth><Debts/></RequireAuth>} />
        <Route path="/payments" element={<RequireAuth><Payments/></RequireAuth>} />
        <Route path="/portal" element={<RequireAuth><MemberPortal/></RequireAuth>} />
      </Routes>
    </div>
  )
}
