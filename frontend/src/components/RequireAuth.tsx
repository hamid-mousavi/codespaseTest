import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const tokenFromState = useAppSelector(s => s.auth.token)
  const token = tokenFromState ?? localStorage.getItem('access_token')
  const location = useLocation()
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

export default RequireAuth
