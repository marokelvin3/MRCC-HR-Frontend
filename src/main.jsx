import React from 'react'
import { createRoot } from 'react-dom/client'
import { API_URL } from './config'

function Login({ setToken }) {
  const [username, setUsername] = React.useState('Admin')
  const [password, setPassword] = React.useState('admin@12345')
  const [error, setError] = React.useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      localStorage.setItem('token', data.token)
      setToken(data.token)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center'}}>
      <form onSubmit={submit} style={{background:'white',padding:24,borderRadius:16,boxShadow:'0 8px 24px rgba(0,0,0,0.08)',width:360}}>
        <div style={{display:'grid', placeItems:'center', marginBottom:12}}>
          <img src="/logo.png" alt="MRCC Logo" style={{height:56, objectFit:'contain'}} />
        </div>
        <h1 style={{textAlign:'center', marginTop:0}}>MRCC WorkForce Hub</h1>
        <div style={{display:'grid', gap:10}}>
          <label>Username
            <input value={username} onChange={e=>setUsername(e.target.value)} required style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #ddd'}} />
          </label>
          <label>Password
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required style={{width:'100%',padding:10,borderRadius:8,border:'1px solid #ddd'}} />
          </label>
          {error && <div style={{color:'crimson'}}>{error}</div>}
          <button style={{width:'100%',padding:10,borderRadius:8,border:'none',background:'#003366',color:'white',cursor:'pointer'}}>Sign in</button>
        </div>
      </form>
    </div>
  )
}

function Dashboard({ setToken }) {
  const [me, setMe] = React.useState(null)
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'light')

  React.useEffect(()=>{
    document.body.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  React.useEffect(()=>{
    const token = localStorage.getItem('token')
    fetch(`${API_URL}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(setMe).catch(()=>{})
  }, [])

  const logout = () => { localStorage.removeItem('token'); setToken(null) }

  return (
    <div style={{padding:20}}>
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,background:'#003366',color:'white',padding:'10px 20px',borderRadius:8,boxShadow:'0 2px 6px rgba(0,0,0,0.2)'}}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <img src="/logo.png" alt="MRCC Logo" style={{height:28}} />
          <h2 style={{margin:0}}>WorkForce Hub</h2>
        </div>
        <div>
          <button onClick={()=>setTheme(theme==='light'?'dark':'light')} style={{marginRight:12,padding:'6px 12px',borderRadius:6,border:'none',cursor:'pointer'}}>
            {theme==='light'?'🌙 Dark':'🌞 Light'}
          </button>
          <button onClick={logout} style={{padding:'6px 12px',borderRadius:6,border:'none',cursor:'pointer'}}>Logout</button>
        </div>
      </header>
      <main style={{display:'grid', gap:16}}>
        <div style={{background:'white',padding:16,borderRadius:12,boxShadow:'0 4px 12px rgba(0,0,0,0.06)'}}>
          <h3 style={{marginTop:0}}>Welcome {me?.username || '...'}</h3>
          <p>Role: <b>{me?.role || '...'}</b></p>
        </div>
      </main>
      <style>{`
        body[data-theme='dark'] { background:#1b1f27; color:#eee }
        body[data-theme='light'] { background:#f5f7fb; color:#111 }
      `}</style>
    </div>
  )
}

function App() {
  const [token, setToken] = React.useState(localStorage.getItem('token'))
  if (!token) return <Login setToken={setToken} />
  return <Dashboard setToken={setToken} />
}

createRoot(document.getElementById('root')).render(<App />)
