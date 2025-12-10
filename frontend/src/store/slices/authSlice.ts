import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const login = createAsyncThunk('auth/login', async (payload: { username: string; password: string }) => {
  const res = await api.post('/auth/login', payload)
  return res.data
})

const slice = createSlice({
  name: 'auth',
  initialState: { user: null as any, token: null as string | null, loading: false },
  reducers: {
    logout(state) { state.user = null; state.token = null; localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token') }
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => { state.loading = true })
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false
      state.token = action.payload.accessToken
      state.user = { username: 'admin' }
      localStorage.setItem('access_token', action.payload.accessToken)
      localStorage.setItem('refresh_token', action.payload.refreshToken)
    })
    builder.addCase(login.rejected, (state) => { state.loading = false })
  }
})

export const { logout } = slice.actions
export default slice.reducer
