import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Units from './pages/Units'
import Debts from './pages/Debts'
import Payments from './pages/Payments'
import MemberPortal from './pages/MemberPortal'

export default function App(){
  return (
    <div>
      <nav>
        <Link to="/">Dashboard</Link> | <Link to="/members">Members</Link> | <Link to="/units">Units</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<Dashboard/>} />
        <Route path="/members" element={<Members/>} />
        <Route path="/units" element={<Units/>} />
        <Route path="/debts" element={<Debts/>} />
        <Route path="/payments" element={<Payments/>} />
        <Route path="/portal" element={<MemberPortal/>} />
      </Routes>
    </div>
  )
}
