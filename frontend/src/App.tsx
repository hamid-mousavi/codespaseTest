import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import MemberDetail from './pages/MemberDetail'
import Units from './pages/Units'
import Debts from './pages/Debts'
import Payments from './pages/Payments'
import MemberPortal from './pages/MemberPortal'
import RequireAuth from './components/RequireAuth'
import Layout from './components/Layout'

export default function App(){
  return (
    <div>
      <nav>
        <Link to="/">Dashboard</Link> | <Link to="/members">Members</Link> | <Link to="/units">Units</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<RequireAuth><Layout><Dashboard/></Layout></RequireAuth>} />
        <Route path="/members" element={<RequireAuth><Layout><Members/></Layout></RequireAuth>} />
        <Route path="/members/:id" element={<RequireAuth><Layout><MemberDetail/></Layout></RequireAuth>} />
        <Route path="/units" element={<RequireAuth><Layout><Units/></Layout></RequireAuth>} />
        <Route path="/debts" element={<RequireAuth><Layout><Debts/></Layout></RequireAuth>} />
        <Route path="/payments" element={<RequireAuth><Layout><Payments/></Layout></RequireAuth>} />
        <Route path="/portal" element={<RequireAuth><Layout><MemberPortal/></Layout></RequireAuth>} />
      </Routes>
    </div>
  )
}
