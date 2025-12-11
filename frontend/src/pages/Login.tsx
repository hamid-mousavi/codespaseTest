import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { login } from '../store/slices/authSlice'

export default function Login(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const dispatch = useAppDispatch()
  const auth = useAppSelector(s => s.auth)
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/'

  useEffect(() => {
    if (auth.token || localStorage.getItem('access_token')) {
      navigate(from, { replace: true })
    }
  }, [auth.token, navigate, from])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    try {
      await dispatch(login({ username, password })).unwrap()
      navigate(from, { replace: true })
    } catch (err: any) {
      // Show server-provided error when available for easier debugging
      const serverMsg = err?.response?.data?.error || err?.response?.data?.message
      const message = serverMsg || err?.message || 'Login failed'
      setErrorMessage(message)
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '2rem auto' }}>
      <div className="form">
        <h2>Sign in</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginTop: 8 }}>
            <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
          </div>
          <div style={{ marginTop: 12 }}>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          </div>
          <div style={{ marginTop: 14 }}>
            <button className="btn" type="submit" disabled={auth.loading}>
              {auth.loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          {errorMessage && (
            <div className="error">{errorMessage}</div>
          )}
        </form>
      </div>
    </div>
  )
}
